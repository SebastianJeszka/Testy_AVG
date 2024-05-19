import { TableComponent } from './table.component';
import {
  NgModule,
  Injector,
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  InjectionToken,
  Optional,
  SkipSelf
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';
import { ColumnDefinitionDirective } from './column-definition.directive';
import { TableServiceOptions } from './table.model';
import { PaginatorModule } from '../paginator/paginator.module';

@NgModule({
  declarations: [TableComponent, ColumnDefinitionDirective],
  exports: [TableComponent, ColumnDefinitionDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, PaginatorModule]
})
export class TableModule {
  static forRoot(options?: TableServiceOptions): ModuleWithProviders<any> {
    return {
      ngModule: TableModule,
      providers: [
        {
          provide: FOR_ROOT_OPTIONS_TOKEN,
          useValue: options
        },
        {
          provide: TableServiceOptions,
          useFactory: provideTableOptions,
          deps: [FOR_ROOT_OPTIONS_TOKEN]
        }
      ]
    };
  }

  constructor(private injector: Injector, @Optional() @SkipSelf() parentModule?: TableModule) {
    if (!parentModule) {
      const mcTable = createCustomElement(TableComponent, { injector });
      customElements.define('mc-table', mcTable);
    }
  }
}
export var FOR_ROOT_OPTIONS_TOKEN = new InjectionToken<TableServiceOptions>(
  'forRoot() TableServiceOptions configuration.'
);

export function provideTableOptions(options?: TableServiceOptions): TableServiceOptions {
  const tableOptions = new TableServiceOptions();

  if (options) {
    if (typeof options.pageSize === 'number') {
      tableOptions.pageSize = options.pageSize;
    }
    if (Array.isArray(tableOptions.pageSizeOptions)) {
      tableOptions.pageSizeOptions = options.pageSizeOptions;
    }
  }

  return tableOptions;
}
