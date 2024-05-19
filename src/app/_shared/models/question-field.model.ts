import { FieldTypes } from './field-types.enum';
import { OptionItem } from './option.model';
import { AdditionalValidators } from './additional-validators.enum';
import { AppGridsterItem } from './tab.model';
import { FileUploadResponse } from './file-response.model';
import { RuleSet } from 'src/app/external-modules/query-builder/query-builder.interfaces';
import { DictionaryExternalConfig } from './dictionary-external-config.model';
import { DictionaryLevelData } from './dictionary.model';
import { ExternalValiatorType } from './external-validator.model';

export class QuestionField {
  id: string = null;
  type: FieldTypes | string;
  title: string = '';
  techName: string = '';
  validation: FieldValidations;
  readOnly: boolean = false;
  placeholder?: string = '';
  description?: string = '';
  options?: OptionItem[] = []; // if radio, select, checkbox...
  returnOnlySelectedOptions?: boolean = false;
  dictionaryName?: string = null;
  multiLevelTree?: boolean;
  multiple?: boolean; // for select
  searchEnabled?: boolean = null;
  queryWhenShowField?: RuleSet;
  repeatingSectionGrid?: AppGridsterItem[];
  repeatingSectionConfig?: RepeatingSectionConfig;
  showRequiredFieldsInfo?: boolean = null;
  consentSectionConfig?: ConsentSectionConfig;
  dictionaryExternalConfig?: DictionaryExternalConfig;
  defaultValue?: string;
  downloadFileExtensionTypes?: DownloadFileExtension[] = [];
  dictionaryLevelsData?: DictionaryLevelData[] = [];
  mapperKeyForRegisterGov?: string = null;
  externalValidator?: ExternalValiatorType;
  repeatingSectionViewType: RepeatingSectionViewType = RepeatingSectionViewType.DEFAULT;
  customizedValue: any;
  confirmation?: ConfirmationConfig;
  states?: QuestionFieldState[] = [];
  reportLabel?: string;
  isConfig?: boolean;
  isCustomized?: boolean = false;
  apiSourceConfig?: ApiSourceConfig;

  __userAnswer?: string | string[];

  constructor() {
    this.validation = new FieldValidations();
    this.confirmation = new ConfirmationConfig();
  }
}

export enum RepeatingSectionViewType {
  DEFAULT = 'DEFAULT',
  TABLE = 'TABLE'
}

export type QuestionFieldState = {
  type: QuestionFieldStates;
  query: string;
};

export enum QuestionFieldStates {
  HIDDEN = 'HIDDEN',
  DISABLED = 'DISABLED',
  MAX_LENGTH = 'MAX_LENGTH',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_VALUE = 'MAX_VALUE',
  MIN_VALUE = 'MIN_VALUE',
  MAX_DATE = 'MAX_DATE',
  MIN_DATE = 'MIN_DATE',
  DATE_FROM_NOW = 'DATE_FROM_NOW',
  DATE_UNTIL_NOW = 'DATE_UNTIL_NOW',
  PATTERN = 'PATTERN',
  MAX_FILES_NUMBER = 'MAX_FILES_NUMBER',
  MAX_FILE_SIZE = 'MAX_FILE_SIZE'
  // TODO additionalValidator
}

export class MoveQuestion {
  question: AppGridsterItem;
  toTab: any; // index
  questionIndex?: number;
}

export class FieldValidations {
  required: boolean = true;
  maxLength: number = null;
  minLength: number = null;
  maxValue: number = null;
  minValue: number = null;
  additionalValidator: AdditionalValidators = null;
  minDate: string = null;
  maxDate: string = null;
  dateFromNow: boolean = null;
  dateUntilNow: boolean = null;
  pattern: string = null;
  maxFilesNumber: number = null;
  maxFileSize: number = null;
  fileFormats: string[] = null;
  verifySignature?: boolean = false;
}

export class RepeatingSectionConfig {
  maxRepeat: number = null;
  addBtnName: string = null;
  deleteBtnName: string = null;
  oneItemRequired: boolean = null;
  rows: number = null;
  cols: number = null;
}

export class Consent {
  constructor(public description: string = '', public required: boolean = false) {}
}

export class ConsentSectionConfig {
  consents: Consent[] = [];
  files: FileUploadResponse[] = [];
  selectAllEnabled: boolean = null;
}

export class ConfirmationConfig {
  isRequired: boolean = false;
  title?: string = '';
}

export enum DownloadFileExtension {
  HTML = 'HTML',
  PDF = 'PDF'
}

export class SimpleAnswer {
  questionFieldId: string;
  answers: string[];
  files: FileData[];
  visited: boolean = false;
}

export class FileData {
  constructor(public businessId: string, public name: string) {}
}

export const stateLabels = {
  [QuestionFieldStates.HIDDEN]: 'Ukryty',
  [QuestionFieldStates.DISABLED]: 'Tylko do odczytu',
  [QuestionFieldStates.MAX_LENGTH]: 'Walidacja - maxLength',
  [QuestionFieldStates.MIN_LENGTH]: 'Walidacja - minLength',
  [QuestionFieldStates.MAX_VALUE]: 'Walidacja - maxValue',
  [QuestionFieldStates.MIN_VALUE]: 'Walidacja - minValue',
  [QuestionFieldStates.MIN_DATE]: 'Walidacja - minDate',
  [QuestionFieldStates.MAX_DATE]: 'Walidacja - maxDate',
  [QuestionFieldStates.DATE_FROM_NOW]: 'Walidacja - dateFromNow',
  [QuestionFieldStates.DATE_UNTIL_NOW]: 'Walidacja - dateUntilNow',
  [QuestionFieldStates.PATTERN]: 'Walidacja - pattern',
  [QuestionFieldStates.MAX_FILES_NUMBER]: 'Walidacja - maxFilesNumber',
  [QuestionFieldStates.MAX_FILE_SIZE]: 'Walidacja - maxFileSize'
};

export const statesOptionItems = [
  { id: QuestionFieldStates.HIDDEN, name: stateLabels[QuestionFieldStates.HIDDEN] },
  { id: QuestionFieldStates.DISABLED, name: stateLabels[QuestionFieldStates.DISABLED] },
  { id: QuestionFieldStates.MAX_LENGTH, name: stateLabels[QuestionFieldStates.MAX_LENGTH] },
  { id: QuestionFieldStates.MIN_LENGTH, name: stateLabels[QuestionFieldStates.MIN_LENGTH] },
  { id: QuestionFieldStates.MAX_VALUE, name: stateLabels[QuestionFieldStates.MAX_VALUE] },
  { id: QuestionFieldStates.MIN_VALUE, name: stateLabels[QuestionFieldStates.MIN_VALUE] },
  { id: QuestionFieldStates.MIN_DATE, name: stateLabels[QuestionFieldStates.MIN_DATE] },
  { id: QuestionFieldStates.MAX_DATE, name: stateLabels[QuestionFieldStates.MAX_DATE] },
  { id: QuestionFieldStates.DATE_FROM_NOW, name: stateLabels[QuestionFieldStates.DATE_FROM_NOW] },
  { id: QuestionFieldStates.DATE_UNTIL_NOW, name: stateLabels[QuestionFieldStates.DATE_UNTIL_NOW] },
  { id: QuestionFieldStates.PATTERN, name: stateLabels[QuestionFieldStates.PATTERN] },
  { id: QuestionFieldStates.MAX_FILES_NUMBER, name: stateLabels[QuestionFieldStates.MAX_FILES_NUMBER] },
  { id: QuestionFieldStates.MAX_FILE_SIZE, name: stateLabels[QuestionFieldStates.MAX_FILE_SIZE] }
];

export class ApiSourceConfig {
  constructor(
    public apiSourceUrl: string = '',
    public answerProperty: string = '',
    public jsonAtaQuery: string = '',
    public dynamicFieldVariable: string = ''
  ) {}
}
