import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditImageDialogComponent, EditImageDialogRef } from '../components/dialog/edit-image-dialog/edit-image-dialog.component';
import { MetaElementStoreService } from '../services/meta-element-store.service';
import { MetaElement } from '../entities/meta-element';
import { Subscription } from 'rxjs';

/*
  Todos :
  v récupérer le metaElement lié à l'id
  v souscrire au store les changements de l'élément
  v ajouter le unsuscribe onDestroy
  - convertir les fields en staff-dot notation
  - modifier les champs via un form
  v pousser les diffs au store
 */

@Directive({
  selector: '[dynamic-img]',
})
export class DynamicImgDirective implements OnInit, OnDestroy {

  @Input('id') dataId: string;
  @Input('media-index') dataMediaIndex: string;

  private metaElementChanges: Subscription;
  metaElement: MetaElement;

  constructor(
    private dialog: MatDialog,
    private metaElementStoreService: MetaElementStoreService,
    private ref: ElementRef
  ) {
  }

  ngOnInit() {
    this.metaElementChanges = this.metaElementStoreService.watchElement(this.dataId)
      .subscribe(metaElement => this.onMetaElement(metaElement));
  }

  ngOnDestroy() {
    this.metaElementChanges.unsubscribe();
  }

  onMetaElement(metaElement: MetaElement) {
    console.log('new value', metaElement);
    this.metaElement = metaElement;
    this.ref.nativeElement.setAttribute('src', this.getSrc());
  }

  @HostListener('click') onClick() {
    // only fetch once, if necessary (meaning after click event, not before)
    if (!this.metaElement) {
      this.metaElementStoreService
        .getMetaElementByElementId(this.dataId)
        .subscribe(metaElement => (this.onMetaElement(metaElement), this.openDialog()));
    } else {
      this.openDialog();
    }
  }

  private openDialog() {
    const dialogRef: EditImageDialogRef = this.dialog.open(EditImageDialogComponent, {
      width: '400px',
      data: {
        metaElement: this.metaElement
      }
    });

    dialogRef.afterClosed().subscribe(media => {
      console.log('The dialog was closed', media);
      if (media) {
        const url = 'http://localhost:3006/assets/files/1cee24b0-ea90-11e9-a5ce-5dde280071d4.png';
        this.metaElement.setField(this.getImageUrlFieldKey(), media.absoluteUrl);
      }
    });
  }

  private getFieldUuidKey() {
    return `_image_${this.dataMediaIndex}_uuid`;
  }

  private getImageUrlFieldKey() {
    return `_image_${this.dataMediaIndex}_url`;
  }

  private getSrc() {
    // const fieldUuidValue = this.metaElement && this.metaElement.data.fields[this.getFieldUuidKey()];
    const imageUrl = this.metaElement && this.metaElement.data.fields[this.getImageUrlFieldKey()];

    return imageUrl || '/assets/img/image-placeholder.png';
  }
}
