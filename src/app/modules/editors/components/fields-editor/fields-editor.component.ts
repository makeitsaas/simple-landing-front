import { AfterViewInit, Compiler, Component, ComponentFactoryResolver, NgModule, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HtmlElementDataService, IPageLayers } from '../../services/html-element-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InlineFieldComponent } from '../../forms/inputs/inline-field/inline-field.component';
import { EditInputComponent } from '../../forms/inputs/edit-input/edit-input.component';
import { AutofocusDirective } from '../../directives/autofocus.directive';
import { DynamicValueComponent } from '../../forms/inputs/dynamic-value/dynamic-value.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@env';

@Component({
  templateUrl: './fields-editor.component.html'
})
export class FieldsEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('pageContainer', {read: ViewContainerRef}) pageContainer: ViewContainerRef;

  layers: IPageLayers;
  stylesUrl: SafeResourceUrl[] = [];

  constructor(
    private htmlElementsService: HtmlElementDataService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.htmlElementsService.getPageLayers('1').subscribe(layers => {
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
    const component = Component({
      template: layers.contentHtml
    })(class {
    });

    const module = NgModule({
      imports: [CommonModule, FormsModule],
      declarations: [component, InlineFieldComponent, EditInputComponent, AutofocusDirective, DynamicValueComponent]
    })(class {
    });

    this.compiler.compileModuleAndAllComponentsAsync(module)
      .then(factories => {
        // Get the component factory.
        const componentFactory = factories.componentFactories[0];
        // Create the component and add to the view.
        const componentRef = this.pageContainer.createComponent(componentFactory);
      });
  }
}
