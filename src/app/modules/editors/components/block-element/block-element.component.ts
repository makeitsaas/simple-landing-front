import {
  AfterViewInit, Compiler,
  Component, ComponentFactory,
  ComponentFactoryResolver,
  ElementRef, NgModule,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InlineFieldComponent } from '../../forms/inputs/inline-field/inline-field.component';
import { CommonModule } from '@angular/common';
import { EditInputComponent } from '../../forms/inputs/edit-input/edit-input.component';
import { FormsModule } from '@angular/forms';
import { AutofocusDirective } from '../../directives/autofocus.directive';

@Component({
  selector: 'block-element',
  templateUrl: './block-element.component.html'
})
export class BlockElementComponent implements OnInit, AfterViewInit {
  blockContent: any;
  @ViewChild('myTemplate') myTemplate;
  @ViewChild('autre', {read: ViewContainerRef}) autre: ViewContainerRef;
  @ViewChild('magicContainer', {read: ViewContainerRef}) magicContainer: ViewContainerRef;
  template: any;

  child: ComponentFactory<any>;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private el: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler
  ) {
    this.child = this.componentFactoryResolver.resolveComponentFactory(InlineFieldComponent);
  }

  ngAfterViewInit() {
    // console.log(this.myTemplate);
    // setTimeout(() => {
    //   this.template = this.myTemplate;
    //   this.autre.createComponent(this.child);
    // }, 1000);

    this.doSomeMagic();
  }

  ngOnInit() {
    const div = this.renderer.createElement('app-inline-field');
    this.renderer.appendChild(this.el.nativeElement, div);
    this.blockContent = this.sanitizer.bypassSecurityTrustHtml('<b>content</b><app-inline-field></app-inline-field>');
  }

  doSomeMagic() {
    // this.compiler.clearCache();
    // const component = Component({
    //   template: '<div>This is the dynamic template <app-inline-field></app-inline-field></div>',
    //   styles: [':host {color: red}']
    // })(class {});
    //
    // const module = NgModule({
    //   imports: [CommonModule, FormsModule],
    //   declarations: [component, InlineFieldComponent, EditInputComponent, AutofocusDirective]
    // })(class {});
    //
    // this.compiler.compileModuleAndAllComponentsAsync(module)
    //   .then(factories => {
    //     // Get the component factory.
    //     const componentFactory = factories.componentFactories[0];
    //     // Create the component and add to the view.
    //     const componentRef = this.magicContainer.createComponent(componentFactory);
    //   });
  }
}
