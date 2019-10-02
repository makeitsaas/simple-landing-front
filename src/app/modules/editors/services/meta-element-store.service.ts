import { Injectable } from '@angular/core';
import { MetaElement } from '../entities/meta-element';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ElementDataService } from './element-data.service';
import { HttpClient } from '@angular/common/http';
import { ElementData } from '../entities/element-data';
import { ElementDiff } from '../entities/element-diff';
import { MetaElementStore } from '../store/meta-element.store';

@Injectable()
export class MetaElementStoreService {

  diffList: { metaElement: MetaElement, diff: ElementDiff }[] = [];
  prevIndex = 0;

  private treeChangeSubject = new ReplaySubject<any>(null);
  public treeChange: Observable<any> = this.treeChangeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private elementDataService: ElementDataService
  ) {
  }

  getNewMetaElement(options?: ElementData | any): MetaElement {
    const metaElement = new MetaElement(options);

    metaElement.storeDiffCallback = (diff: ElementDiff) => {
      // console.log('storeDiffCallback', diff);
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

  getPageMetaElements(pageId: string): Observable<MetaElement[]> {
    return this.elementDataService.getPageElements(pageId).pipe(map(elements => {
      return elements.map(data => {
        const existingMeta = MetaElementStore.findMetaByElementById(data.id);
        if (existingMeta) {
          existingMeta.setRemoteDataResponse(data);
          return existingMeta;
        } else {
          return this.getNewMetaElement(data);
        }
      });
    })).pipe(metaElements => {
      return metaElements;
    });
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

  onDiffApplied(metaElement: MetaElement, diff: ElementDiff) {
    // when everything is clean for the store => emitting new values
    if (diff.action === 'updateLocation') {
      this.treeChangeSubject.next(metaElement);
    }
  }

  addDiff(metaElement: MetaElement, diff: ElementDiff) {
    this.resetPrevIndex();
    this.diffList.push({
      metaElement,
      diff
    });
  }

  private resetPrevIndex() {
    this.diffList.splice(this.diffList.length - this.prevIndex, this.prevIndex);
    this.prevIndex = 0;
  }

  findMetaByLocalId(localId: number): MetaElement | void {
    return MetaElementStore.findMetaByLocalId(localId);
  }
}
