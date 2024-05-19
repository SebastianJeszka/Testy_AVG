import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFieldFormComponent } from './add-field-form/add-field-form.component';
import { QuestionFieldComponent } from './question-field/question-field.component';
import { GeneratorComponent } from './generator-core/generator.component';
import { ImportDictionariesComponent } from './import-dictionaries/import-dictionaries.component';
import { SharedModule } from '../_shared/shared.module';
import { GridOfFieldsComponent } from './grid-of-fields/grid-of-fields.component';
import { SettingsPopupComponent } from './generator-core/settings-popup/settings-popup.component';
import { FormsListComponent } from './forms-list/forms-list.component';
import { GeneratorRoutingModule } from './generator-routing.module';
import { TabsFlowComponent } from './tabs-flow-editor/tabs-flow.component';
import { StatisticComponent } from './statistic/statistic.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { AddLinkFormComponent } from './tabs-flow-editor/add-link-form/add-link-form.component';
import { EditLinkPopupComponent } from './tabs-flow-editor/edit-link-popup/edit-link-popup.component';
import { EditTabPopupComponent } from './generator-core/edit-tab-popup/edit-tab-popup.component';
import { FetchResultsPopupComponent } from './generator-core/fetch-results-popup/fetch-results-popup.component';
import { ProcessPopupComponent } from './process-popup/process-popup.component';
import { RepeatedSectionPopupComponent } from './generator-core/repeated-section-popup/repeated-section.component';
import { PlacedRepeatedSectionComponent } from './question-field/placed-repeated-section/placed-repeated-section.component';
import { RepeatedSectionItemComponent } from './generator-core/repeated-section-popup/repeated-section-item/repeated-section-item.component';
import { GeneralFormSettingsComponent } from './generator-core/settings-popup/general-form-settings/general-form-settings.component';
import { SendingResultsComponent } from './generator-core/settings-popup/sending-results/sending-results.component';
import { ConsentsSectionComponent } from './consents-section/add-consents-section.component';
import { OneConsentComponent } from './consents-section/one-consent/one-consent.component';
import { PlacedConsentsSectionComponent } from './question-field/placed-consents-section/placed-consents-section.component';
import { ConfirmationInputComponent } from './question-field/confirmation-input/confirmation-input.component';
import { OneProcessViewComponent } from './process-popup/one-process-view/one-process-view.component';
import { AutocompleteProcessResponseComponent } from './process-popup/autocomplete-process-response/autocomplete-process-response.component';
import { QueryBuilderModule } from '../external-modules/query-builder/query-builder.module';
import { FormHistoryComponent } from './generator-core/form-history/form-history.component';
import { VersionStateComponent } from './generator-core/version-state/version-state.component';
import { NavigationStepsComponent } from './generator-core/navigation-steps/navigation-steps.component';
import { DefineGovRegisterComponent } from './process-popup/define-gov-register-mapper/define-gov-register.component';
import { TabCopyPopupComponent } from './tabs-flow-editor/tab-copy-popup/tab-copy-popup.component';
import { EmailsProcessComponent } from './process-popup/emails-process/emails-process.component';
import { RedirectProcessComponent } from './process-popup/redirect-process/redirect-process.component';
import { ImportFormComponent } from './import-form/import-form.component';
import { CloneFormComponent } from './clone-form/clone-form.component';
import { FieldStateQueryComponent } from './field-state-query-popup/field-state-query.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SummaryEditorComponent } from './summary-editor/summary-editor.component';
import { PreviewGeneratorComponent } from './process-popup/preview-generator/preview-generator.component';
import { AccessFormSettingsComponent } from './generator-core/settings-popup/access-form-settings/access-form-settings.component';
import { ContextMenuContainerComponent } from '../_shared/components/custom-context-menu/custom-context-menu.component';
import { RegisteredUsersListComponent } from './generator-core/registered-users-list/registered-users-list.component';
import { StatisticPreviewPopupComponent } from './statistic/statistic-preview-popup/statistic-preview-popup.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserVerificationProcessComponent } from './process-popup/user-verification-process/user-verification-process.component';
import { TicketProcessComponent } from './process-popup/ticket-process/ticket-process.component';
import { DistributionListComponent } from './generator-core/distribution-list/distribution-list.component';
import { ExternalDataProcessComponent } from './process-popup/external-data-process/external-data-process.component';
import { BackgroundDataContextMenuComponent } from './generator-core/settings-popup/background-data-context-menu/background-data-context-menu.component';
import { RecipientListSetingsComponent } from './generator-core/settings-popup/recipient-list-settings/recipient-list-settings.component';
import { AddConfigFieldFormComponent } from './add-config-field-form/add-config-field-form.component';
import { ChangeOwnerComponent } from './change-owner/change-owner.component';
import { NgxIbeRolesModule } from '@ngx-ibe/core/roles';

const COMPONENTS = [
  GeneratorComponent,
  AddFieldFormComponent,
  AddConfigFieldFormComponent,
  QuestionFieldComponent,
  ImportDictionariesComponent,
  GridOfFieldsComponent,
  SettingsPopupComponent,
  StatisticPreviewPopupComponent,
  FormsListComponent,
  TabsFlowComponent,
  StatisticComponent,
  AddLinkFormComponent,
  EditLinkPopupComponent,
  EditTabPopupComponent,
  FetchResultsPopupComponent,
  ProcessPopupComponent,
  RepeatedSectionPopupComponent,
  PlacedRepeatedSectionComponent,
  RepeatedSectionItemComponent,
  GeneralFormSettingsComponent,
  SendingResultsComponent,
  ConsentsSectionComponent,
  OneConsentComponent,
  PlacedConsentsSectionComponent,
  OneProcessViewComponent,
  AutocompleteProcessResponseComponent,
  FormHistoryComponent,
  VersionStateComponent,
  NavigationStepsComponent,
  RedirectProcessComponent,
  TabCopyPopupComponent,
  ConfirmationInputComponent,
  CloneFormComponent,
  SummaryEditorComponent,
  PreviewGeneratorComponent,
  EmailsProcessComponent,
  FieldStateQueryComponent,
  ImportFormComponent,
  AccessFormSettingsComponent,
  DefineGovRegisterComponent,
  ContextMenuContainerComponent,
  RegisteredUsersListComponent,
  UserVerificationProcessComponent,
  TicketProcessComponent,
  DistributionListComponent,
  ExternalDataProcessComponent,
  RecipientListSetingsComponent,
  BackgroundDataContextMenuComponent,
  ChangeOwnerComponent
];

const MODULES = [
  CommonModule,
  SharedModule,
  GeneratorRoutingModule,
  NgxGraphModule,
  QueryBuilderModule,
  NgxChartsModule,
  MonacoEditorModule.forRoot(),
  NgxIbeRolesModule.forChild(['/assets/roles/generator.json'])
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...MODULES],
  exports: [],
  providers: []
})
export class GeneratorModule {}
