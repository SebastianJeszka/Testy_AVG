import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree.component';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule } from '@angular/common/http';
import { TreePartDirective } from './tree-part.directive';

@NgModule({
  declarations: [TreeComponent, TreePartDirective],
  exports: [TreeComponent, TreePartDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, HttpClientModule]
})
export class TreeModule {
  static forRoot(options?: any): ModuleWithProviders<any> {
    return {
      ngModule: TreeModule,
      providers: []
    };
  }

  constructor(private injector: Injector, @Optional() @SkipSelf() parentModule?: TreeModule) {
    if (!parentModule) {
      const mcTree = createCustomElement(TreeComponent, { injector });
      customElements.define('gov-w-tree', mcTree);
    }
  }
}
