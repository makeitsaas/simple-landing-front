import { Injectable } from '@angular/core';
import { MetaElement } from '../entities/meta-element';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ElementDataService, UpdateElementDto } from './element-data.service';
import { HttpClient } from '@angular/common/http';
import { ElementData, ElementDataInterface } from '../entities/element-data';
import { ElementDataDiff } from '../entities/element-data-diff';
import { MetaElementStore } from '../store/meta-element.store';
import * as generateUuid from 'uuid/v1';
import { EditorContextService } from './editor-context.service';

const sessionUuid = generateUuid();

export class DiffEntry {
  readonly uuid = generateUuid();
  readonly sessionUuid = sessionUuid;
  readonly metaElement: MetaElement;
  readonly diff: ElementDataDiff;
  readonly createdAt: Date = new Date();

  constructor(metaElement: MetaElement, diff: ElementDataDiff) {
    this.metaElement = metaElement;
    this.diff = diff;
  }
}

@Injectable()
export class MetaElementStoreService {

  diffList: DiffEntry[] = [];
  prevIndex = 0;

  readonly storeSession = generateUuid();
  private treeChangeSubject = new ReplaySubject<any>(null);
  public treeChange: Observable<any> = this.treeChangeSubject.asObservable();
  private changeSubject = new ReplaySubject<any>(null);
  public change: Observable<MetaElement> = this.changeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private elementDataService: ElementDataService,
    private editorContextService: EditorContextService
  ) {
  }

  resetStore(): void {
    this.diffList = [];
    this.prevIndex = 0;
    this.treeChangeSubject.next(null);
    this.changeSubject.next(null);
    MetaElementStore.purge(); // => should rather implement a bulk refresh from API, but currently easier this way to avoid problems
  }

  watchElement(elementDataId: string | number): Observable<MetaElement> {
    return this.change
      .pipe(filter(diff => diff && (diff.data.id === elementDataId || `${diff.data.id}` === `${elementDataId}`)));
  }

  watchMetaElement(localId: number): Observable<MetaElement> {
    return this.change.pipe(filter(diff => diff && diff.localId === localId));
  }

  getNewMetaElement(options: ElementData | any, pageId: string = this.editorContextService.getCurrentPageId()): MetaElement {
    const metaElement = new MetaElement(options);

    if (!options || !options.id) {
      const requestDate = new Date();
      // there need to create an element on the API side
      this.elementDataService.createElement(pageId, options.type, {settings: options.settings}).subscribe(elementData => {
        metaElement.setRemoteDataResponse(elementData, this.getDiffsSinceDate(requestDate, metaElement));
      });
    }

    metaElement.storeDiffCallback = (diff: ElementDataDiff) => {
      metaElement.useNextData(diff);
      this.addDiff(metaElement, diff);
      this.onDiffApplied(metaElement, diff);
    };
    // metaEl.onDiff(diff => {
    //    store cannot subscribe to behavior subject because it creates circular dependency on JSON.stringify(MetaElement)
    //    MetaElement is converted to JSON by DnD plugin
    //    store => all items => item.diffSubject.asObservable => store
    //
    //    To make it possible, only handle MetaElement.localId in DnDItems
    //   console.log('diff from store', diff);
    // });
    MetaElementStore.add(metaElement);
    return metaElement;
  }

  getMetaElementByElementId(dataElementId: string): Observable<MetaElement> {
    const existingMeta = MetaElementStore.findMetaByElementId(dataElementId);
    if (existingMeta) {
      console.log('retrieved from cache');
      return of(existingMeta);
    }
    return this.elementDataService.getElement(dataElementId).pipe(map(data => {
      console.log('retrieved from api');
      return this.getOrCreateMetaElement(data);
    }));
  }

  getPageMetaElements(pageId: string): Observable<MetaElement[]> {
    return this.elementDataService.getPageElements(pageId).pipe(map(elements => {
      return elements.map(data => {
        return this.getOrCreateMetaElement(data);
      });
    })).pipe(metaElements => {
      return metaElements;
    });
  }

  private getOrCreateMetaElement(data: ElementDataInterface): MetaElement {
    const existingMeta = MetaElementStore.findMetaByElementId(data.id);
    if (existingMeta) {
      existingMeta.setRemoteDataResponse(data, []);
      return existingMeta;
    } else {
      return this.getNewMetaElement(data);
    }
  }

  canGoNext() {
    return this.prevIndex > 0;
  }

  canGoPrev() {
    return this.prevIndex < this.diffList.length;
  }

  goNext() {
    if (this.canGoNext()) {
      const diffToApply = this.diffList[(this.diffList.length - 1) - (this.prevIndex - 1)];
      console.log('apply up', diffToApply.diff);
      diffToApply.metaElement.useNextData(diffToApply.diff);
      this.prevIndex--;
      this.onDiffApplied(diffToApply.metaElement, diffToApply.diff);
    }
  }

  goPrev() {
    if (this.canGoPrev()) {
      const diffToApply = this.diffList[(this.diffList.length - 1) - this.prevIndex];
      console.log('apply down', diffToApply.diff);
      diffToApply.metaElement.usePreviousData(diffToApply.diff);
      this.prevIndex++;
      this.onDiffApplied(diffToApply.metaElement, diffToApply.diff);
    }
  }

  private resetPrevIndex() {
    this.diffList.splice(this.diffList.length - this.prevIndex, this.prevIndex);
    this.prevIndex = 0;
  }

  private addDiff(metaElement: MetaElement, diff: ElementDataDiff) {
    this.resetPrevIndex();
    this.diffList.push(new DiffEntry(metaElement, diff));
  }

  private onDiffApplied(metaElement: MetaElement, diff: ElementDataDiff) {
    // when everything is clean for the store => emitting new values
    if (diff.action === 'updateLocation') {
      this.treeChangeSubject.next(metaElement);
    }
    this.changeSubject.next(metaElement);
  }

  private getDiffsSinceDate(date: Date, metaElement?: MetaElement) {
    return this.diffList
      .filter(entry => metaElement ? (metaElement === entry.metaElement) : true)
      .filter(entry => entry.createdAt.getTime() > date.getTime());
  }

  /*

    Save logic

   */

  saveDiffs(pageId: string): Promise<ElementData[]> {
    console.log('save');
    return MetaElementStore.onElementsReady().then(() => {
      const dtoById = this.convertDiffsToDtoList();
      this.addNewElementsPositionToDto(pageId, dtoById);
      const requests: Observable<any>[] = [];
      for (const elementDataId in dtoById) {
        if (dtoById.hasOwnProperty(elementDataId)) {
          console.log('element update will be', elementDataId, dtoById[elementDataId]);
          requests.push(this.elementDataService.updateElement(elementDataId, dtoById[elementDataId]));
        }
      }

      return Promise.all(requests.map(reqObservable => new Promise<ElementData>((resolve, reject) => {
        reqObservable.subscribe((element: ElementData) => {
          resolve(element);
        }, err => {
          reject(err);
        });
      })));
    });
  }

  /**
   * This function purpose is to establish the list of all elements changes that have to be saved.
   * These changes will all be gathered in dtoById objects.
   *
   * Processing :
   *   - In this function, we browse diffList to check all keys that might have changed (treeLocation, field, translation, ...).
   *   - When a key change is found, we use as value what metaElement.data currently has (this is what user sees)
   *   - We finally set dtoById expected (key, value) parameter
   */
  private convertDiffsToDtoList(): { [elementId: number]: UpdateElementDto } {
    const dtoById: { [elementId: number]: UpdateElementDto } = {};

    this.diffList.map(entry => {
      const localData = entry.metaElement.data;
      const elementId = localData.id;
      if (!dtoById[elementId]) {
        dtoById[elementId] = {};
      }
      let key: string;
      switch (entry.diff.action) {
        case 'updateLocation':
          this.updatePositionsInDto(entry.metaElement, dtoById);
          break;
        case 'updateField':
          key = entry.diff.nextValue.key;

          if (!dtoById[elementId].fields) {
            dtoById[elementId].fields = {};
          }

          dtoById[elementId].fields[key] = localData.fields[key];
          break;
        case 'updateTranslation':
          const diffLang = entry.diff.nextValue.lang;
          key = entry.diff.nextValue.key;

          if (!dtoById[elementId].translations) {
            dtoById[elementId].translations = {};
          }
          if (!dtoById[elementId].translations[diffLang]) {
            dtoById[elementId].translations[diffLang] = {};
          }

          dtoById[elementId].translations[diffLang][key] = localData.translations[diffLang][key];
          break;
      }
    });
    return dtoById;
  }

  private addNewElementsPositionToDto(pageId: string, dtoById: { [elementId: number]: UpdateElementDto }) {
    const newMetaElements = MetaElementStore.findNewMetaElements(pageId);

    newMetaElements.forEach(metaElement => this.updatePositionsInDto(metaElement, dtoById));
  }

  /**
   * Updates position and parent for metaElement.data and siblings
   *
   * @param metaElement metaElement that has moved since last save
   * @param dtoById object that contains data about elements that will be saved with ElementDataService.updateElement
   */
  private updatePositionsInDto(metaElement: MetaElement, dtoById: { [elementId: number]: UpdateElementDto }) {
    const metaElementId = metaElement.localId;
    const location = metaElement.treeLocation;
    if (location) {
      const siblings: MetaElement[] = MetaElementStore.findMetaSiblings(metaElement);
      const parentMeta = MetaElementStore.findMetaByLocalId(location.parentMetaElementId);
      if (parentMeta) {
        siblings.forEach(meta => {
          if (!dtoById[meta.data.id]) {
            dtoById[meta.data.id] = {};
          }
          dtoById[meta.data.id].parent = parentMeta.data.id;
          dtoById[meta.data.id].position = meta.treeLocation && meta.treeLocation.position;
        });
      }
    } else {
      dtoById[metaElementId].parent = null;
    }
  }
}
