import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './_shared/components/not-found/not-found.component';
import { ErrorComponent } from './_shared/components/error/error.component';
import { AuthGuard } from './_shared/guards/auth.guard';
import { DownloadPageComponent } from './_shared/components/download-page/download-page.component';
import { UsersMgmtComponent } from '@ngx-ibe/ngx-users-mgmt';
import { environment } from 'src/environments/environment';
import { ManageUsersGuard } from './_shared/guards/manage-users.guard';

const routes: Routes = [
  {
    path: 'generator',
    canActivate: [AuthGuard],
    loadChildren: () => import('./generator/generator.module').then((m) => m.GeneratorModule)
  },
  {
    path: 'dictionaries',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dictionaries/dictionaries.module').then((m) => m.DictionariesModule)
  },
  {
    path: 'users-mgmt',
    data: { appId: environment.appId },
    canActivate: [ManageUsersGuard],
    component: UsersMgmtComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/generator'
  },
  {
    path: 'file/:id',
    canActivate: [AuthGuard],
    component: DownloadPageComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
