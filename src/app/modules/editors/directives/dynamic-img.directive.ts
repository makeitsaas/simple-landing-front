import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EditImageDialogComponent } from '../components/dialog/edit-image-dialog/edit-image-dialog.component';
import { MetaElementStoreService } from '../services/meta-element-store.service';

@Directive({
  selector: '[dynamic-img]',
})
export class DynamicImgDirective implements OnInit {

  @Input('id') dataId: string | number;
  @Input('media-index') dataMediaIndex: number;

  constructor(
    private dialog: MatDialog,
    private metaElementStoreService: MetaElementStoreService
  ) {
  }

  @HostListener('click') onClick() {
    console.log('data id', this.dataId, this.dataMediaIndex);
    const dialogRef = this.dialog.open(EditImageDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });

    console.log('store session', this.metaElementStoreService.storeSession);
  }

  ngOnInit(): void {
    console.log('img');
  }
}
