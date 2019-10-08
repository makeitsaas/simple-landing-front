import { AfterViewInit, Compiler, Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ElementDataService } from '../../services/element-data.service';
import { EditorContextService } from '../../services/editor-context.service';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { AbstractEditor } from '../abstract/abstract-editor';

@Component({
  templateUrl: './styles-editor.component.html',
  styleUrls: ['./styles-editor.component.scss']
})
export class StylesEditorComponent extends AbstractEditor implements OnInit, AfterViewInit {

  textareaModel: string;
  compiledStyles: SafeHtml;
  editableStyles: { [key: string]: string } = {};

  constructor(
    private htmlElementsService: ElementDataService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private editorContextService: EditorContextService,
    private compiler: Compiler,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.pageId = this.editorContextService.getCurrentPageId();
    this.htmlElementsService.getPageLayers(this.pageId).subscribe(layers => {
      this.layers = layers;
      this.stylesUrl = this.trustStyles(layers, this.sanitizer);
    });
  }

  onModelChange() {
    console.log('parent changes too', this.compiledStyles);
    this.editableStyles.main = this.textareaModel || '';
    const htmlToTrust = `<style>${this.editableStyles.main}</style>`;
    this.compiledStyles = this.sanitizer.bypassSecurityTrustHtml(htmlToTrust);
    // this.addToHead(this.textareaModel);
  }

  addToHead(css: string) {

    // const css = '* {background: pink;}';
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
