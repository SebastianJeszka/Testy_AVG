import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryBuilderComponent } from './query-builder.component';
import { FormsModule } from '@angular/forms';
import { QueryButtonGroupDirective } from './query-builder.directives';
import { MultiLevelSelectComponent } from './multilevel-select/multilevel-select.component';
import { SharedModule } from 'src/app/_shared/shared.module';

const DIRECTIVES = [QueryButtonGroupDirective];

@NgModule({
  declarations: [...DIRECTIVES, QueryBuilderComponent, MultiLevelSelectComponent],
  imports: [CommonModule, SharedModule, FormsModule],
  exports: [...DIRECTIVES, QueryBuilderComponent]
})
export class QueryBuilderModule {}
