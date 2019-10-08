import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'code-editor',
  templateUrl: 'code-editor.component.html',
})
export class CodeEditorComponent implements OnInit {
  editorOptions = {theme: 'vs-dark', language: 'scss'};
  codeDefault = '* {\nbackground: blue;\n}';

  editorChanges: Subject<string> = new Subject<string>();

  @Input() code: string;
  @Output() codeChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this.editorChanges
      .pipe(
        debounceTime(1000),
        filter(() => !this.hasThisMonacoEditorErrors())
        )
      .subscribe(value => {
        this.codeChange.emit(value);
      });
  }

  onCodeChange() {
    console.log('push change');
    this.editorChanges.next(this.codeDefault);
  }

  hasThisMonacoEditorErrors() {
    console.log('check errors');
    const monaco = (window as any).monaco;

    return monaco.editor.getModelMarkers().length;
  }
}
