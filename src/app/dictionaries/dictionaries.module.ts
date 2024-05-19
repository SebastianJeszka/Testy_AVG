import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionariesListComponent } from './dictionaries-list/dictionaries-list.component';
import { SharedModule } from '../_shared/shared.module';
import { DictionariesRoutingModule } from './dictionaries.routing';
import { DictionaryViewComponent } from './dictionary-view/dictionary-view.component';
import { AddDictionaryComponent } from './add-dictionary/add-dictionary.component';
import { DictionaryTreeComponent } from './dictionary-tree/dictionary-tree.component';
import { DictionaryItemFormComponent } from './dictionary-item-form/dictionary-item-form.component';
import { DictionaryTreeItemComponent } from './dictionary-tree-item/dictionary-tree-item.component';
import { DictionaryConfigTreeComponent } from './external-api/dictionary-config-tree/dictionary-config-tree.component';
import { DictionaryConfigItemComponent } from './external-api/dictionary-config-item/dictionary-config-item.component';
import { DictionaryConfigFormComponent } from './external-api/dictionary-config-form/dictionary-config-form.component';
import { DictionaryConfigViewComponent } from './external-api/dictionary-config-view/dictionary-config-view.component';
import { NgxIbeRolesModule } from '@ngx-ibe/core/roles';

@NgModule({
  declarations: [
    DictionariesListComponent,
    DictionaryViewComponent,
    AddDictionaryComponent,
    DictionaryTreeComponent,
    DictionaryItemFormComponent,
    DictionaryTreeItemComponent,
    DictionaryConfigTreeComponent,
    DictionaryConfigItemComponent,
    DictionaryConfigFormComponent,
    DictionaryConfigViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DictionariesRoutingModule,
    NgxIbeRolesModule.forChild(['/assets/roles/dictionary.json'])
  ],
  exports: []
})
export class DictionariesModule {}
