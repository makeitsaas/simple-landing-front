import { Component, OnInit } from '@angular/core';
import { ElementDataService } from '../../services/element-data.service';
import { EditorContextService } from '../../services/editor-context.service';
import { MetaElementStoreService } from '../../services/meta-element-store.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { HelpEditorDialogComponent } from '../dialog/help-editor-dialog/help-editor-dialog.component';
import { delay } from 'rxjs/operators';

@Component({
  templateUrl: './base-editor.component.html',
  styleUrls: ['./base-editor.component.scss']
})
export class BaseEditorComponent implements OnInit {
  pageId: string;
  pendingSave = false;
  canGoPrev = false;
  canGoNext = false;
  debugStyles = false;

  constructor(
    private htmlElementsService: ElementDataService,
    private editorContextService: EditorContextService,
    private metaElementStoreService: MetaElementStoreService,
    private snackBarService: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    console.log('base editor init');
    this.pageId = this.editorContextService.getCurrentPageId();
    this.htmlElementsService.getPageElements(this.pageId).subscribe((elements: any[]) => {
      console.log('elements', elements);
    });
    this.metaElementStoreService.change
      .pipe(delay(1))   // sub components might refresh store after view render => add delay to avoid render errors "value has changed"
      .subscribe(() => this.refreshButtons());
  }

  save() {
    this.pendingSave = true;
    this.metaElementStoreService.saveDiffs(this.pageId)
      .then(() => this.snackBarService.open('Saved!', undefined, {duration: 2000}))
      .catch(() => this.snackBarService.open('Error!', undefined, {duration: 2000}))
      .finally(() => this.pendingSave = false);
  }

  editBack() {
    this.metaElementStoreService.goPrev();
  }

  editForward() {
    this.metaElementStoreService.goNext();
  }

  refreshButtons() {
    this.canGoPrev = this.metaElementStoreService.canGoPrev();
    this.canGoNext = this.metaElementStoreService.canGoNext();
  }

  showHelp() {
    const dialogRef = this.dialog.open(HelpEditorDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
