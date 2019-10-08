import { AfterViewInit, ChangeDetectorRef, Compiler, Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ElementDataService } from '../../services/element-data.service';
import { EditorContextService } from '../../services/editor-context.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AbstractEditor } from '../abstract/abstract-editor';
import { SassService } from '../../services/sass.service';

@Component({
  templateUrl: './styles-editor.component.html',
  styleUrls: ['./styles-editor.component.scss']
})
export class StylesEditorComponent extends AbstractEditor implements OnInit, AfterViewInit {

  editorHtmlId: string;
  editorModel: string;
  compiledStyles: SafeHtml;
  editableStyles: { [key: string]: string } = {};
  scssError: string;

  constructor(
    private htmlElementsService: ElementDataService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private editorContextService: EditorContextService,
    private compiler: Compiler,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private sassService: SassService
  ) {
    super();
  }

  ngOnInit() {
    this.editorHtmlId = `session-id-${Math.floor(Math.random() * 100000)}`;
  }

  ngAfterViewInit() {
    this.pageId = this.editorContextService.getCurrentPageId();
    this.htmlElementsService.getPageLayers(this.pageId).subscribe(layers => {
      this.layers = layers;
      this.stylesUrl = this.trustStyles(layers, this.sanitizer);
    });
  }

  onModelChange() {
    console.log('parent changes too', this.editorModel);
    this.convertScssToCss(this.editorModel).then(css => {
      console.log('my css', css);
      delete this.scssError;
      this.editableStyles.main = this.editorModel || '';
      const htmlToTrust = `<style>${css}</style>`;
      this.compiledStyles = this.sanitizer.bypassSecurityTrustHtml(htmlToTrust);
      this.ref.detectChanges();
    }).catch(errorMessage => (console.error(errorMessage), this.scssError = errorMessage, this.ref.detectChanges()));
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
