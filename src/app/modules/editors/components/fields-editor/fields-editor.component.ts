import { AfterViewInit, Compiler, Component, ComponentFactoryResolver, NgModule, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ElementDataService, IPageLayers } from '../../services/element-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InlineFieldComponent } from '../../forms/inputs/inline-field/inline-field.component';
import { EditInputComponent } from '../../forms/inputs/edit-input/edit-input.component';
import { AutofocusDirective } from '../../directives/autofocus.directive';
import { DynamicValueComponent } from '../../forms/inputs/dynamic-value/dynamic-value.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@env';
import { EditorContextService } from '../../services/editor-context.service';
import { DynamicImgDirective } from '../../directives/dynamic-img.directive';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import * as generateUuid from 'uuid/v1';
import { MetaElementStoreService } from '../../services/meta-element-store.service';
import { SharedModule } from '@shared/shared.module';


@Component({
  templateUrl: './fields-editor.component.html'
})
export class FieldsEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('pageContainer', {read: ViewContainerRef}) pageContainer: ViewContainerRef;

  layers: IPageLayers;
  stylesUrl: SafeResourceUrl[] = [];

  constructor(
    private htmlElementsService: ElementDataService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private editorContextService: EditorContextService,
    private compiler: Compiler,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const pageId = this.editorContextService.getCurrentPageId();
    this.htmlElementsService.getPageLayers(pageId).subscribe(layers => {
      console.log('page layers', layers);
      this.layers = layers;
      this.stylesUrl = layers.styles
        .filter(asset => asset.url)
        .map(asset => {
          let url = asset.url;
          if (/^\//.test(url)) {
            url = `${environment.APIUrl}${url}`;
          }
          console.log('trust', url);
          return this.sanitizer.bypassSecurityTrustResourceUrl(url);
        });
      this.appendPageAsComponent(layers);
    });
  }

  appendPageAsComponent(layers: IPageLayers) {
    this.compiler.clearCache();
    const generatedComponentSelector = `local-component-${generateUuid()}`;
    const component = Component({
      selector: generatedComponentSelector,
      template: layers.contentHtml,
      styles: [`:host {height: 10px; width: 10px;}`]
    })(class {
    });

    const module = NgModule({
      imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        MatDialogModule,
        MatButtonModule,
      ],
      declarations: [
        component,
        InlineFieldComponent,
        EditInputComponent,
        AutofocusDirective,
        DynamicImgDirective,
        DynamicValueComponent,
      ],
      providers: [
        MetaElementStoreService
      ],
      entryComponents: [
      ]
    })(class {
    });

    this.compiler.compileModuleAndAllComponentsAsync(module)
      .then(factories => {
        console.log('factories', factories);
        // Get the component factory.
        const componentFactory = factories.componentFactories.filter(factory => factory.selector === generatedComponentSelector)[0];
        // Create the component and add to the view.
        const componentRef = this.pageContainer.createComponent(componentFactory);
      });
  }
}
