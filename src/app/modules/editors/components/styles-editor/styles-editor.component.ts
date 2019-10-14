import { AfterViewInit, ChangeDetectorRef, Compiler, Component, ComponentFactoryResolver, OnDestroy, OnInit } from '@angular/core';
import { ElementDataService } from '../../services/element-data.service';
import { EditorContextService } from '../../services/editor-context.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AbstractEditor } from '../abstract/abstract-editor';
import { SassService } from '../../services/sass.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MetaElementStoreService } from '@modules/editors/services/meta-element-store.service';

@Component({
  templateUrl: './styles-editor.component.html',
  styleUrls: ['./styles-editor.component.scss']
})
export class StylesEditorComponent extends AbstractEditor implements OnInit, AfterViewInit, OnDestroy {

  openSidenav = true;
  editorHtmlId: string;
  editorModel: string;
  compiledStyles: SafeHtml;
  editableStyles: { [key: string]: string } = {};
  scssError: string|void;
  scssErrorSubject: Subject<string|void> = new Subject<string|void>();

  private subscriptions: Subscription[] = [];

  constructor(
    private htmlElementsService: ElementDataService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private editorContextService: EditorContextService,
    private metaElementStoreService: MetaElementStoreService,
    private compiler: Compiler,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private sassService: SassService
  ) {
    super();
  }

  ngOnInit() {
    this.metaElementStoreService.resetStore();
    this.editorHtmlId = `session-id-${Math.floor(Math.random() * 100000)}`;
    this.scssErrorSubject.pipe(
      debounceTime(1500)
    ).subscribe(error => (this.scssError = error, this.ref.detectChanges()));
  }

  ngAfterViewInit() {
    this.pageId = this.editorContextService.getCurrentPageId();
    const s1 = this.htmlElementsService.getPageLayers(this.pageId).subscribe(layers => {
      this.layers = layers;
      this.stylesUrl = this.trustStyles(layers, this.sanitizer);
    });

    this.subscriptions.push(s1);
  }

  ngOnDestroy() {
    this.subscriptions.map((sub, i) => sub.unsubscribe());
  }

  onModelChange() {
    console.log('parent changes too', this.editorModel);
    this.scssErrorSubject.next();
    this.convertScssToCss(this.editorModel).then(css => {
      console.log('my css', css);
      delete this.scssError;
      this.editableStyles.main = this.editorModel || '';
      const htmlToTrust = `<style>${css}</style>`;
      this.compiledStyles = this.sanitizer.bypassSecurityTrustHtml(htmlToTrust);
      this.ref.detectChanges();
    }).catch(errorMessage => this.scssErrorSubject.next(errorMessage));
  }

  wrapScss(scssData: string) {
    return `#${this.editorHtmlId} {\n\n${scssData}\n}`;
  }

  convertScssToCss(scssData: string) {
    return this.sassService.convertToCss(this.wrapScss(scssData));
  }

  addToHead() {
    const css = '* {background: pink;}';
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    console.log('style', style);
    head.appendChild(style);
    setTimeout(() => {
      style.remove();
    }, 2000);
  }
}
