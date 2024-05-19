import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DictionariesListComponent } from './dictionaries-list/dictionaries-list.component';

const routes: Routes = [{ path: '', component: DictionariesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionariesRoutingModule {}
