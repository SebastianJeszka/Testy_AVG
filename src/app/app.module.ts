import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { SharedModule } from './_shared/shared.module';
import { AppRoutingModule } from './app.routing';
import { DownloadPageComponent } from './_shared/components/download-page/download-page.component';
import { LoaderComponent } from './_shared/components/loader/loader.component';
import { NgxIbeRolesModule } from '@ngx-ibe/core/roles';
import { UsersMgmtModule } from '@ngx-ibe/ngx-users-mgmt';
import { ImportApiSourcesComponent } from './generator/import-api-sources/import-api-sources.component';
import { NgxIbeCoreProviders } from '@ngx-ibe/core';
import { NgxIbeContextSelectorComponent } from '@ngx-ibe/core/context';
import { environment } from 'src/environments/environment';
import { GATEWAY_URL, IBE_APP_NAME, IBE_APP_ORIGIN } from '@ngx-ibe/core/common';
import { NgxIbeContextSelectorContentDirective } from '@ngx-ibe/core/context';
import { NgxIbeLoaderComponent } from '@ngx-ibe/core/loader';

@NgModule({
  declarations: [AppComponent, DownloadPageComponent, LoaderComponent, ImportApiSourcesComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    NgxIbeRolesModule.forRoot(),
    UsersMgmtModule,
    NgxIbeContextSelectorComponent,
    NgxIbeContextSelectorContentDirective,
    NgxIbeLoaderComponent
  ],
  providers: [
    ...NgxIbeCoreProviders,
    {
      provide: GATEWAY_URL,
      useValue: environment.gatewayUrl
    },
    {
      provide: IBE_APP_NAME,
      useValue: 'FormGen'
    },
    {
      provide: IBE_APP_ORIGIN,
      useValue: ['MSTUDENT', 'SIO', 'LOGIN_GOV_PL']
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
