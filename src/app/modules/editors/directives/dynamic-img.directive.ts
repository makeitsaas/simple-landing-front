import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditImageDialogComponent } from '../components/dialog/edit-image-dialog/edit-image-dialog.component';
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
    const dialogRef = this.dialog.open(EditImageDialogComponent, {
      width: '400px',
      data: {
        metaElement: this.metaElement
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.metaElement.setField(this.getFieldUuidKey(), 'b0d8cfe0-ea90-11e9-91cd-35b843176917');
    });
  }

  private getFieldUuidKey() {
    return `_image_${this.dataMediaIndex}_uuid`;
  }

  private getSrc() {
    const fieldUuidValue = this.metaElement && this.metaElement.data.fields[this.getFieldUuidKey()];

    if (fieldUuidValue) {
      return `http://localhost:3006/assets/files/${fieldUuidValue}.png`;
    } else {
      return '/assets/img/image-placeholder.png';
    }
  }
}
