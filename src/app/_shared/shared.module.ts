import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './inputs/text-input/text-input.component';
import { CodeBlockInputComponent } from './inputs/input-code-block/input-code-block.component';
import { RadioInputComponent } from './inputs/radio-input/radio-input.component';
import { SelectInputComponent } from './inputs/select-input/select-input.component';
import { TextareaInputComponent } from './inputs/textarea-input/textarea-input.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DigitsValidateDirective } from './directives/digits-validate.directive';
import { ConfirmationPopoverModule } from '../external-modules/quick-confirm/confirmation-popover.module';
import { GridsterModule } from 'angular-gridster2';
import { CheckboxInputComponent } from './inputs/checkbox-input/checkbox-input.component';
import { MatSortModule } from '@angular/material/sort';
import { TruncateTextDirective } from './directives/truncate-text.directive';
import { MatTreeModule } from '@angular/material/tree';
import { StopPropagationDirective } from './directives/stop-propagation.directive';
import { CustomContextMenuDirective } from './directives/custom-context-menu.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AlertDirective } from './directives/alert.directive';
import { ErrorComponent } from './components/error/error.component';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CKEditorModule } from 'ckeditor4-angular';
import { DeactivateGeneratorGuard } from './guards/deactivate-generator.guard';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { DatePickerInputComponent } from './inputs/datepicker-input/datepicker-input.component';
import { CustomDateAdapter } from './inputs/datepicker-input/custom-date-adapter';
import { MaxDateValidateDirective } from './directives/max-date-validate.directive';
import { MinDateValidateDirective } from './directives/min-date-validate.directive';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { SelectSearchInputComponent } from './inputs/select-input/select-search-input/select-search-input.component';
import { TableModule } from './components/table/table.module';
import { PaginatorModule } from './components/paginator/paginator.module';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { TreeModule } from './components/tree/tree.module';
import { GridItemDirective } from './directives/grid-item.directive';
import { InputFilesComponent } from './inputs/input-files/input-files.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InfoFieldComponent } from './components/info-field/info-field.component';
import { EmailValidateDirective } from './validators/email-validate.directive';
import { PostalCodeValidateDirective } from './validators/postalCode-validate.directive';
import { PhoneValidateDirective } from './validators/phone-validate.directive';
import { UniqueTechNameDirective } from './validators/uniq-tech-name.directive';
import { AlreadySelectedValueDirective } from './validators/already-selected-value.directive';
import { BlueHeaderComponent } from './components/blue-header/blue-header.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { PositiveNumbersDirective } from './directives/positive-number.directive';
import { MessageLabelComponent } from './components/message-label/message-label.component';
import { UniqueDirective } from './validators/uniqe.directive';
import { EqualValidateDirective } from './validators/equal-validate.directive';
import { UsedTechNameAvailableDirective } from './validators/available-techName-used.directive';
import { OrderByPipe } from './pipes/order-by.pipe';
import { McAccordionComponent } from './components/mc-accordion/mc-accordion.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NoWhitespaceDirective } from './directives/no-whitespace-validate.directive';

import {
  NgxMatNativeDateModule,
  NgxMatDatetimePickerModule,
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { CustomDateTimeAdapter } from './inputs/datepicker-input/custom-date-time-adapter';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { ManageUsersGuard } from './guards/manage-users.guard';
import { NgxIbeRolesModule } from '@ngx-ibe/core/roles';
import { LoadingDirective } from './directives/loading.directive';

const COMPONENTS = [
  TextInputComponent,
  CodeBlockInputComponent,
  RadioInputComponent,
  SelectInputComponent,
  TextareaInputComponent,
  CheckboxInputComponent,
  DatePickerInputComponent,
  NotFoundComponent,
  ErrorComponent,
  SelectSearchInputComponent,
  IconButtonComponent,
  InputFilesComponent,
  FileUploaderComponent,
  InfoFieldComponent,
  BlueHeaderComponent,
  MessageLabelComponent,
  McAccordionComponent
];

const MATERIAL_COMPONENTS = [
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatTreeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatListModule,
  MatTabsModule,
  MatMenuModule,
  MatDatepickerModule,
  MatNativeDateModule,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatExpansionModule,
  CdkAccordionModule
];

const DIRECTIVES = [
  DigitsValidateDirective,
  TruncateTextDirective,
  StopPropagationDirective,
  AlertDirective,
  MaxDateValidateDirective,
  MinDateValidateDirective,
  GridItemDirective,
  PositiveNumbersDirective,
  EmailValidateDirective,
  PostalCodeValidateDirective,
  PhoneValidateDirective,
  UniqueTechNameDirective,
  UniqueDirective,
  AlreadySelectedValueDirective,
  EqualValidateDirective,
  UsedTechNameAvailableDirective,
  CustomContextMenuDirective,
  NoWhitespaceDirective,
  LoadingDirective
];

const MODULES_EXPORT = [
  MonacoEditorModule,
  GridsterModule,
  FormsModule,
  ImageCropperModule,
  CKEditorModule,
  TableModule,
  TreeModule,
  PaginatorModule,
  NgbTimepickerModule,
  NgxJsonViewerModule
];

const PIPES = [FileSizePipe, SafeHtmlPipe, OrderByPipe];

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: ['l', 'LL']
  },
  display: {
    dateInput: 'DD/MM/YYYY HH:mm:ss',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
  imports: [
    CommonModule,
    HttpClientModule,
    ConfirmationPopoverModule.forRoot({}),
    RouterModule,
    ContextMenuModule,
    ...MODULES_EXPORT,
    ...MATERIAL_COMPONENTS
  ],
  exports: [
    ConfirmationPopoverModule,
    NgxIbeRolesModule,
    ContextMenuModule,
    ...COMPONENTS,
    ...MATERIAL_COMPONENTS,
    ...MODULES_EXPORT,
    ...DIRECTIVES,
    ...PIPES
  ],
  providers: [
    DeactivateGeneratorGuard,
    ManageUsersGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    {
      provide: NgxMatDateAdapter,
      useClass: CustomDateTimeAdapter,
      deps: [MAT_DATE_LOCALE]
    }
  ]
})
export class SharedModule {}
