import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { FormsListComponent } from './forms-list/forms-list.component';
import { GeneratorComponent } from './generator-core/generator.component';
import { DeactivateGeneratorGuard } from '../_shared/guards/deactivate-generator.guard';
import { TabsFlowComponent } from './tabs-flow-editor/tabs-flow.component';
import { SummaryEditorComponent } from './summary-editor/summary-editor.component';
import { StatisticComponent } from './statistic/statistic.component';

const routes: Routes = [
  {
    path: '',
    component: FormsListComponent
  },

  {
    path: 'new',
    component: GeneratorComponent,
    canDeactivate: [DeactivateGeneratorGuard]
  },
  {
    path: 'view/:id',
    component: GeneratorComponent,
    canDeactivate: [DeactivateGeneratorGuard]
  },
  {
    path: 'flow/:id',
    component: TabsFlowComponent,
    canDeactivate: [DeactivateGeneratorGuard]
  },
  {
    path: 'statistic/:id',
    component: StatisticComponent,
    canDeactivate: [DeactivateGeneratorGuard]
  },
  {
    path: 'summary/:id',
    component: SummaryEditorComponent,
    canDeactivate: [DeactivateGeneratorGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneratorRoutingModule {}
