import { Component, EventEmitter, OnInit, OnDestroy, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import {
  ConsentSectionConfig,
  QuestionField,
  ConfirmationConfig,
  QuestionFieldState,
  DownloadFileExtension,
  stateLabels,
  statesOptionItems,
  ApiSourceConfig
} from 'src/app/_shared/models/question-field.model';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { FieldLabels, FieldTypeOptions, FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { ImportDictionariesComponent } from 'src/app/generator/import-dictionaries/import-dictionaries.component';
import { Dictionary } from 'src/app/_shared/models/dictionary.model';
import { CKEditor4 } from 'ckeditor4-angular';
import { AdditionalValidators } from 'src/app/_shared/models/additional-validators.enum';
import { FormService } from 'src/app/_shared/services/form.service';
import { buildQueryBuilderConfig } from 'src/app/_shared/utils/query-builder-config';
import { BaseExtensions } from 'src/app/_shared/components/file-uploader/file-uploader.component';
import { ckeditorConfig } from 'src/app/_shared/models/ckeditor-config.model';
import { NgForm, NgModel } from '@angular/forms';
import { findAndFocusFirstIncorrectInput } from 'src/app/_shared/utils/form.utilits';
import { Subscription } from 'rxjs';
import { normalizeString } from 'src/app/_shared/utils/normalize-string.utilits';
import { ProcessConfigService } from 'src/app/_shared/services/process-config.service';
import { Branch } from 'src/app/_shared/components/tree/branch.model';
import { QueryBuilderConfig, RuleSet } from 'src/app/external-modules/query-builder/query-builder.interfaces';
import { isFieldWithOptions, setDefaultValues } from 'src/app/_shared/utils/add-field-form.utilits';
import { trimBoundFieldTemplates } from 'src/app/_shared/utils/interpolation-brackets.utilits';
import { FieldStateQueryComponent } from '../field-state-query-popup/field-state-query.component';
import { CustomContextMenuItem } from 'src/app/_shared/models/custom-context-menu.model';
import { ExternalValiatorType } from 'src/app/_shared/models/external-validator.model';
import { GmlStructureService } from 'src/app/_shared/services/gml-structure.service';
import { getTemporaryId } from 'src/app/_shared/utils/unique-id.utilits';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImportApiSourcesComponent } from '../import-api-sources/import-api-sources.component';
import { environment } from 'src/environments/environment';

const INPUT_TYPES_WITH_CONFIRMATION_OPTION: string[] = [FieldTypes.TEXT_FIELD, FieldTypes.NUMBER];

@Component({
  selector: 'add-field-form',
  templateUrl: './add-field-form.component.html',
  styleUrls: ['./add-field-form.component.scss']
})
export class AddFieldFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('techNameField') techNameField: NgModel;
  @ViewChild(NgForm) ngForm: NgForm;
  isFormValid: boolean = true; // this flag needed to avoid error: Expression has changed after it was checked
  field: QuestionField = null;

  fieldTypes = FieldTypes;
  fieldTypeLabels = FieldLabels;
  fieldTypesOptions = FieldTypeOptions;

  disabledByConfig = {
    techName: false,
    dictionaryName: false,
    type: false,
    validation: {
      required: false,
      maxLength: false,
      minLength: false,
      maxValue: false,
      minValue: false,
      additionalValidator: false,
      minDate: false,
      maxDate: false,
      dateFromNow: false,
      dateUntilNow: false,
      pattern: false,
      maxFilesNumber: false,
      maxFileSize: false,
      fileFormats: false,
      verifySignature: false
    },
    title: false,
    readOnly: false
  };

  options: OptionItem[] = [];
  validatorOptions: OptionItem[] = [
    { id: null, name: 'Brak' },
    { id: AdditionalValidators.EMAIL, name: 'Email' },
    { id: AdditionalValidators.PESEL, name: 'Pesel' },
    { id: AdditionalValidators.NIP, name: 'Nip' },
    { id: AdditionalValidators.REGON, name: 'Regon' },
    { id: AdditionalValidators.PATTERN, name: 'Pattern' }
  ];
  downloadFileExtensionOptions: OptionItem[] = [
    { id: DownloadFileExtension.HTML, name: DownloadFileExtension.HTML },
    { id: DownloadFileExtension.PDF, name: DownloadFileExtension.PDF }
  ];
  additionalValidator: OptionItem = null;
  additionalValidators = AdditionalValidators;
  isAvailableOptionConfirmationRequired: boolean;
  externalValidatorOptions: OptionItem[] = [
    { id: null, name: 'Brak' },
    { id: ExternalValiatorType.GOV_XML, name: ExternalValiatorType.GOV_XML }
  ];
  statesOptionItems: OptionItem[] = statesOptionItems;

  // flags
  addingOption: boolean = false;
  currentOption: OptionItem = null;
  isAnswerForRadio = '';
  isOpenQueryBuilder = false;

  formType: FormVersionTypes;
  isEdition: boolean = false;
  isSubmitted: boolean = false;

  newInput: EventEmitter<QuestionField> = new EventEmitter();
  cancel = new EventEmitter();

  formVersionTypes = FormVersionTypes;
  importedDictionary: Dictionary = null;

  ckeditor: CKEditor4.Config = ckeditorConfig();

  queryWhenShow: RuleSet = { condition: '', rules: [] };

  queryBuilderConfig: QueryBuilderConfig = null;

  extentionsList: string[] = BaseExtensions;

  subOfFormChange: Subscription;

  processTypeAndPropertyToAutocomplete: string = null;

  startingTechName: string = '';

  isFieldWithOptions: (type: FieldTypes | string) => boolean = isFieldWithOptions;
  maxFileSize: number = 10;
  readonly defaultMaxFileSize: number = 1;
  readonly defaultMaxFilesNumber: number = 5;

  contextMenuItems: CustomContextMenuItem<string>[] = [];

  showGmlStructure: boolean = false;
  currentGmlStructure = '';
  environment = environment;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddFieldFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { formType: FormVersionTypes; input?: QuestionField },
    public formService: FormService,
    private processConfig: ProcessConfigService,
    private gmlStructureService: GmlStructureService
  ) {}

  get allowTechNameChange(): boolean {
    return this.formService.isAllowedChangeTechName(this.data.input);
  }

  get isPlaceholderAvailable(): boolean {
    return (
      this.field.type === FieldTypes.TEXT_FIELD ||
      this.field.type === FieldTypes.TEXTAREA ||
      this.field.type === FieldTypes.SELECT ||
      this.field.type === FieldTypes.NUMBER
    );
  }

  ngOnInit() {
    this.isEdition = this.data.input ? true : false;

    this.startingTechName = this.field?.techName;

    if (this.isEdition) {
      this.field = JSON.parse(JSON.stringify(this.data.input));
      this.options = this.field.options ? this.field.options.map((o) => o) : [];
      this.initConfirmationField();
    } else {
      this.field = new QuestionField();
      this.options = [];
    }

    if (this.field.isConfig) {
      this.disabledByConfig = {
        techName: !!this.field.techName,
        dictionaryName: !!this.field.dictionaryName,
        type: !!this.field.type,
        validation: {
          required: this.checkValidationValue(this.field.validation.required),
          maxLength: this.checkValidationValue(this.field.validation.maxLength),
          minLength: this.checkValidationValue(this.field.validation.minLength),
          maxValue: this.checkValidationValue(this.field.validation.maxValue),
          minValue: this.checkValidationValue(this.field.validation.minValue),
          additionalValidator: this.checkValidationValue(this.field.validation.additionalValidator),
          minDate: this.checkValidationValue(this.field.validation.minDate),
          maxDate: this.checkValidationValue(this.field.validation.maxDate),
          dateFromNow: this.checkValidationValue(this.field.validation.dateFromNow),
          dateUntilNow: this.checkValidationValue(this.field.validation.dateUntilNow),
          pattern: this.checkValidationValue(this.field.validation.pattern),
          maxFilesNumber: this.checkValidationValue(this.field.validation.maxFilesNumber),
          maxFileSize: this.checkValidationValue(this.field.validation.maxFileSize),
          fileFormats: this.checkValidationValue(this.field.validation.fileFormats),
          verifySignature: this.checkValidationValue(this.field.validation.verifySignature)
        },
        title: !!this.field.title,
        readOnly: !!this.field.readOnly
      };
    }

    this.isAvailableOptionConfirmationRequired = INPUT_TYPES_WITH_CONFIRMATION_OPTION.includes(this.field.type);

    this.formType = this.data.formType;
    this.queryBuilderConfig = buildQueryBuilderConfig(this.formService.currentFormVersion.tabs);
    this.initInputValues();
    this.contextMenuItems = this.formService.getContextMenuItemsWithAllTechNames();

    this.processTypeAndPropertyToAutocomplete = this.processConfig.getInfoOfConnectionToAutoComplete(this.field);

    this.isOpenQueryBuilder = this.field.states?.length > 0;
  }

  ngAfterViewInit() {
    this.subOfFormChange = this.ngForm.form.valueChanges.subscribe((x) => {
      this.isFormValid = this.ngForm ? this.ngForm.form.valid : true;
    });
  }

  checkValidationValue(value): boolean {
    return !(value === null);
  }

  initConfirmationField() {
    if (!this.field.confirmation) {
      this.field.confirmation = new ConfirmationConfig();
    }
  }

  initInputValues() {
    if (this.field.validation?.additionalValidator) {
      this.validatorOptions.filter((opt: OptionItem) => {
        if (opt.id === this.field.validation.additionalValidator && this.field.validation.additionalValidator) {
          this.additionalValidator = opt;
        }
      });
    }

    if (
      this.formType === FormVersionTypes.QUIZ &&
      this.field?.type === FieldTypes.RADIO &&
      this.options.some((opt: OptionItem) => opt.isAnswer)
    ) {
      this.isAnswerForRadio = this.options.find((opt) => opt.isAnswer).name;
    }

    if (this.field.consentSectionConfig && this.data.formType !== this.formVersionTypes.TEMPLATE) {
      this.field.isCustomized = false;
    }
  }

  handleContextMenuEvent({ model, value }) {
    this.field[model] = (this.field[model] || '') + value;
  }

  closeAddField() {
    this.dialogRef.close();
  }

  chooseType(type: OptionItem) {
    this.field.type = type.id;
    this.options = [];
    if (isFieldWithOptions(this.field.type)) {
      setDefaultValues(this.field);
    }
    this.isAvailableOptionConfirmationRequired = INPUT_TYPES_WITH_CONFIRMATION_OPTION.includes(this.field.type);
  }

  saveInputForm() {
    this.isSubmitted = true;
    if (this.ngForm && !this.ngForm?.valid) {
      findAndFocusFirstIncorrectInput(this.ngForm);
      return;
    }
    if (!this.validateRequiredProps()) return;

    this.field.title = this.field.title.trim();
    if (this.importedDictionary?.externalConfig) {
      this.prepareExternalConfig();
    } else {
      this.prepareOptions();
      if (isFieldWithOptions(this.field.type)) {
        this.field.options = this.options;
      }
    }

    this.prepareValidation();

    if (this.isOpenQueryBuilder && this.queryWhenShow && this.queryWhenShow?.rules?.length) {
      this.field.queryWhenShowField = this.queryWhenShow;
    }

    if (!this.isOpenQueryBuilder) {
      this.field.states = [];
    }

    if (!this.field.id) this.field.id = getTemporaryId(this.formService.currentFormVersion);

    this.dialogRef.close(this.field);
  }

  validateRequiredProps() {
    return this.ifOptionsChosen() && this.ifConsentsExist() && this.field?.type;
  }

  ifOptionsChosen() {
    if (
      isFieldWithOptions(this.field.type) &&
      this.options.length === 0 &&
      !this.importedDictionary &&
      !this.field.dictionaryExternalConfig &&
      !this.field.apiSourceConfig?.apiSourceUrl
    )
      return false;
    return true;
  }

  ifConsentsExist() {
    if (this.field.type !== FieldTypes.CONSENT_SECTION) return true;
    return (
      (this.field.consentSectionConfig &&
        this.field.consentSectionConfig?.consents &&
        this.field.consentSectionConfig?.consents?.length > 0) ||
      this.field.isCustomized
    );
  }

  addOption() {
    this.currentOption = new OptionItem();
    this.addingOption = true;
  }

  saveOption() {
    this.options.push(this.currentOption);
    this.currentOption = null;
    this.addingOption = false;
  }

  cancelSaveOption() {
    this.currentOption = null;
    this.addingOption = false;
  }

  removeOption(i) {
    this.options.splice(i, 1);
  }

  onChangeConsentsConfig(conf: ConsentSectionConfig) {
    this.field.consentSectionConfig = conf;
  }

  onExternalValidatorChange() {
    this.field.validation.maxFilesNumber = this.field.externalValidator ? 1 : this.defaultMaxFilesNumber;
  }

  prepareValidation() {
    if (this.field.type === FieldTypes.TEXT_BLOCK) {
      this.field.validation.required = false;
      return;
    }

    if (this.field.type === FieldTypes.FILE_UPLOADER) {
      this.field.validation.maxFileSize = this.field.validation.maxFileSize
        ? +this.field.validation.maxFileSize
        : this.defaultMaxFileSize;
      this.field.validation.maxFilesNumber = this.field.validation.maxFilesNumber
        ? +this.field.validation.maxFilesNumber
        : this.defaultMaxFilesNumber;
    }

    this.field.validation.maxLength = this.field.validation.maxLength
      ? Number(this.field.validation.maxLength)
      : this.field.type === this.fieldTypes.TEXT_FIELD
      ? 255
      : null;

    Object.keys(this.field.validation).forEach((key) => {
      if (
        (key === 'maxLength' || key === 'minLength' || key === 'maxValue' || key === 'minValue') &&
        this.field.validation[key]
      ) {
        this.field.validation[key] = Number(this.field.validation[key]);
      }
    });

    if (this.additionalValidator) {
      this.field.validation.additionalValidator = this.additionalValidator.id as AdditionalValidators;
      if (this.field.validation.additionalValidator !== AdditionalValidators.PATTERN) {
        this.field.validation.pattern = null;
      }
    }
  }

  prepareOptions() {
    if (this.importedDictionary) {
      this.options = this.transformDictionary(this.importedDictionary);
      this.field.multiLevelTree = this.importedDictionary.children.some(
        (branch: Branch) => branch.children?.length > 0
      );
    } else if (!this.importedDictionary && this.options && this.options.length) {
      this.options = this.options.map((opt, index) => {
        opt.id = opt.name;
        if (this.field.type === this.fieldTypes.RADIO) {
          opt['isAnswer'] = this.isAnswerForRadio === opt.name;
        }
        return opt;
      });
    }
  }

  prepareExternalConfig() {
    this.field.dictionaryExternalConfig = this.importedDictionary.externalConfig;
  }

  // dictionary
  transformDictionary(dictionary: Dictionary | Branch): OptionItem[] {
    return dictionary.children.map((branch: Branch) => {
      return {
        name: branch.name,
        id: branch.name.toString(),
        children: branch?.children ? this.transformDictionary(branch) : null
      };
    });
  }

  onImportApiSources() {
    const dialogRef = this.dialog.open(ImportApiSourcesComponent, {
      width: '600px',
      data: { config: this.field.apiSourceConfig },
      panelClass: 'apisource-modal'
    });

    dialogRef.afterClosed().subscribe((apiSourceConfig: ApiSourceConfig) => {
      if (apiSourceConfig) this.field.apiSourceConfig = apiSourceConfig;
      this.options = [];
    });
  }

  onImportDictionariesList() {
    const dialogRef = this.dialog.open(ImportDictionariesComponent, {
      width: '600px', // TODO move to some config,
      data: {
        type: this.field.type
      }
    });

    dialogRef.afterClosed().subscribe((dictionary: Dictionary) => {
      if (dictionary) {
        this.importedDictionary = dictionary;
        this.field.dictionaryName = dictionary.name;
        if (dictionary.dictionaryLevelsData.length) {
          this.field.dictionaryLevelsData = dictionary.dictionaryLevelsData;
        }
      }
    });
  }

  onRemoveDictionary() {
    this.importedDictionary = null;
    if (this.field.dictionaryName) {
      this.field.dictionaryName = null;
      this.field.options = [];
      this.field.multiLevelTree = null;
      this.field.dictionaryExternalConfig = null;
      this.field.dictionaryLevelsData = [];
      this.options = [];
    }
  }

  onRemoveApiSource() {
    if (this.field.apiSourceConfig.apiSourceUrl) {
      this.field.apiSourceConfig = null;
    }
  }

  // query
  onToggleDynamicStates() {
    if (this.isOpenQueryBuilder) {
      if (!this.field.states?.length) {
        this.field.states = [
          {
            type: null,
            query: ''
          }
        ];
      }
    } else {
      this.queryWhenShow = { condition: '', rules: [] };
      // TODO removing if not added any state
    }
  }

  openStateQueryJsonEdition(state: QuestionFieldState) {
    const dialogRef = this.dialog.open(FieldStateQueryComponent, {
      width: '1960px',
      height: '95vh',
      maxWidth: '90vw',
      data: state.query,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((query: string) => {
      if (query) {
        state.query = query;
      }
    });
  }

  onChangeDateValidation(event, type: string) {
    if (type === 'fromNow' && event.target.checked) {
      this.field.validation.minDate = null;
    } else if (type === 'untilNow' && event.target.checked) {
      this.field.validation.maxDate = null;
    }
  }

  onChangeVerifySignatureValidation() {
    this.maxFileSize = this.field.validation.verifySignature ? 5 : 10;
  }

  onChangedExtentions(extentions: string[]) {
    this.field.validation.fileFormats = extentions;
  }

  onChangeTitle() {
    if (this.formType !== FormVersionTypes.SERVICE && !this.startingTechName?.length) {
      this.field.techName = normalizeString(trimBoundFieldTemplates(this.field.title));
    }
  }

  onChangeTechName() {
    this.field.techName = normalizeString(this.field.techName);
  }

  getStateLabel(stateType: string) {
    return stateLabels[stateType];
  }

  ngOnDestroy() {
    if (this.subOfFormChange) this.subOfFormChange.unsubscribe();
  }

  toggleShowFileStructure() {
    if (this.showGmlStructure) {
      if (!this.currentGmlStructure) {
        if (!this.gmlStructureService.gmlStructure) {
          this.gmlStructureService.getGmlStrucutre().subscribe((gmlStructure) => {
            this.gmlStructureService.gmlStructure = gmlStructure;
            this.currentGmlStructure = gmlStructure;
          });
        } else {
          this.currentGmlStructure = this.gmlStructureService.gmlStructure;
        }
      }
    }
  }
}
