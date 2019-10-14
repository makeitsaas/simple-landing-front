import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ElementDataService } from '../../../services/element-data.service';
import { EditorContextService } from '../../../services/editor-context.service';
import { MetaElementStoreService } from '@modules/editors/services/meta-element-store.service';
import { Subscription } from 'rxjs';
import { MetaElement } from '@modules/editors/entities/meta-element';

@Component({
  selector: 'dynamic-value',
  templateUrl: './dynamic-value.component.html'
})
export class DynamicValueComponent implements OnInit, OnDestroy {

  @Input('id') dataId: string;
  @Input('code') dataCode: string;

  private dataType: string | 'fields' | 'translations';
  private dataKey: string;
  private currentLang: string;

  sampleModel = '';

  private metaElement: MetaElement;
  private metaElementChanges: Subscription;

  constructor(
    private el: ElementRef,
    private htmlElementsService: ElementDataService,
    private metaElementStoreService: MetaElementStoreService,
    private editorContextService: EditorContextService
  ) {
  }

  ngOnInit() {
    this.currentLang = this.editorContextService.getCurrentLanguageCode();
    this.sampleModel = this.el.nativeElement.textContent;
    this.metaElementStoreService.getMetaElementByElementId(this.dataId).subscribe(metaElement => this.metaElement = metaElement);
    this.metaElementChanges = this.metaElementStoreService
      .watchElement(this.dataId)
      .subscribe(metaElement => this.onMetaElement(metaElement));
    this.dataType = this.dataCode.split('.')[0];
    this.dataKey = this.dataCode.split('.').slice(1).join('.');
  }

  ngOnDestroy() {
    this.metaElementChanges.unsubscribe();
  }

  onMetaElement(metaElement: MetaElement) {
    this.metaElement = metaElement;
    this.sampleModel = this.getElementValue();
  }

  getElementValue() {
    if (this.dataType === 'translations') {
      return this.metaElement.getTranslation(this.dataKey);
    } else if (this.dataType === 'fields') {
      return this.metaElement.getField(this.dataKey);
    }
  }

  saveEditable(newValue: string) {
    this.sampleModel = newValue;
    if (this.dataType === 'translations') {
      return this.metaElement.setTranslation(this.dataKey, newValue);
    } else if (this.dataType === 'fields') {
      return this.metaElement.setField(this.dataKey, newValue);
    }
  }
}
