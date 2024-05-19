// TODO: wrap emails options into one object, needed to refactor backend

import { AdditionalPropItem } from './sending-results.model';
import { AppGridsterItem } from './tab.model';

export class AppProcess {
  enabled: boolean = false;
  type: ProcessType = null;
  forCopies?: boolean = null;
  redirectProcessData?: RedirectProcessData = null;
  emailsDefineProcessData?: string[] = [];
  emailsDefineMessageTypeResults: boolean = true;
  emailsDefineMessageTypePersonal: boolean = false;
  emailsDefineMessage?: string = '';
  emailsFieldsDefineProcessData?: EmailFieldMapItem[] = [];
  emailsFieldsDefineMessageTypeResults: boolean = true;
  emailsFieldsDefineMessageTypePersonal: boolean = false;
  emailsFieldsDefineMessage?: string = '';
  previewGeneratorType: PreviewGeneratorType = PreviewGeneratorType.STANDARD;
  answerRegisterConfiguration?: AnswerRegisterConfiguration;
  autocompleteMap: ProcessAutocompleteMapItem[] = [];
  registerFormId: string = null;
  registerVerificationErrorMessage: string = '';
  techName?: string = '';
  ticketVerificationMaxAnswers?: number = 0;
  ticketVerificationMessage?: string = '';
  externalDataConfiguration?: ExternalDataConfiguration;
  externalAutocompleteMap?: ProcessAutocompleteMapItem[] = [];
  constructor() {
    this.redirectProcessData = new RedirectProcessData();
  }
}

export enum PreviewGeneratorType {
  STANDARD = 'STANDARD',
  CUSTOM = 'CUSTOM'
}

export enum RedirectType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL'
}

export class EmailFieldMapItem {
  tabId: string;
  fieldId: string;
}

export class ExternalDataConfiguration {
  constructor(
    public url: string = null,
    public urlParams: ExternalDataConfigurationUrlParamsItem[] = null,
    public queryParams: ExternalDataConfigurationItem[] = null,
    public responseMapping: ExternalDataConfigurationItem[] = null
  ) {}
}

export class ExternalDataConfigurationItem {
  constructor(public source: string[] = [], public target: string = null, public transform: string = null) {}
}

export class ExternalDataConfigurationUrlParamsItem {
  constructor(
    public source: string[] = null,
    public target: string = null,
    public transform: string = null,
    public tabId: string = null,
    public fieldId: string = null,
    public testRequestValue: string = null
  ) {}
}

export class AnswerRegisterConfiguration {
  registerId: string;
  answersRegisterFields: AnswerRegisterField[];
  articleTitleIdentifier: string = '';
  fileUploadersTechNames: string[] = [];
}

export class AnswerRegisterField {
  registerColumnName: string;
  fieldIdentifier: string;
  repeatingSectionFieldsIdentifiers: string[];
  fieldIdentificationType: FieldIdentificationTypes;
  blockPresentationData: boolean;
  id?: string;
}

export enum FieldIdentificationTypes {
  TECHNAME = 'TECHNAME',
  SYNTAX = 'SYNTAX'
}

export class ProcessAutocompleteMapItem {
  constructor(public fieldId: string = null, public responseProperty: string = null, public tabId: string = null) {}
}

export class RedirectProcessData {
  urlForRedirect: string = null;
  formId: string = null;
}

export class ProcessResponseMap {
  id: string;
  type: ProcessType;
  responseData: { [key: string]: string };
}

export enum ProcessType {
  LOGIN = 'LOGIN',
  REDIRECT = 'REDIRECT',
  DEFINE_EMAILS = 'DEFINE_EMAILS',
  SIGNING_DOC = 'SIGNING_DOC',
  PREVIEW_GENERATOR = 'PREVIEW_GENERATOR',
  DEFINE_GOV_REGISTER = 'DEFINE_GOV_REGISTER',
  USER_REGISTRATION = 'USER_REGISTRATION',
  USER_VERIFICATION = 'USER_VERIFICATION',
  TICKET_VERIFICATION = 'TICKET_VERIFICATION',
  EXTERNAL_DATA = 'EXTERNAL_DATA'
}

export const ProcessTypeLabels = {
  [ProcessType.LOGIN]: 'Logowanie',
  [ProcessType.REDIRECT]: 'Przekierowanie',
  [ProcessType.DEFINE_EMAILS]: 'Definicja e-maili',
  [ProcessType.SIGNING_DOC]: 'Podpisanie dokumentu',
  [ProcessType.PREVIEW_GENERATOR]: 'Generowanie podglądu',
  [ProcessType.DEFINE_GOV_REGISTER]: 'Konfiguracja rejestru (GOV)',
  [ProcessType.USER_REGISTRATION]: 'Rejestracja użytkowników',
  [ProcessType.USER_VERIFICATION]: 'Weryfikacja użytkownika',
  [ProcessType.TICKET_VERIFICATION]: "Obsługa ticket'ów",
  [ProcessType.EXTERNAL_DATA]: 'Zewnętrzne dane'
};

export const ProcessTypeOptions = [
  { id: ProcessType.LOGIN, name: ProcessTypeLabels[ProcessType.LOGIN] },
  { id: ProcessType.REDIRECT, name: ProcessTypeLabels[ProcessType.REDIRECT] },
  { id: ProcessType.DEFINE_EMAILS, name: ProcessTypeLabels[ProcessType.DEFINE_EMAILS] },
  { id: ProcessType.SIGNING_DOC, name: ProcessTypeLabels[ProcessType.SIGNING_DOC] },
  { id: ProcessType.PREVIEW_GENERATOR, name: ProcessTypeLabels[ProcessType.PREVIEW_GENERATOR] },
  { id: ProcessType.USER_REGISTRATION, name: ProcessTypeLabels[ProcessType.USER_REGISTRATION] },
  { id: ProcessType.DEFINE_GOV_REGISTER, name: ProcessTypeLabels[ProcessType.DEFINE_GOV_REGISTER] },
  { id: ProcessType.USER_VERIFICATION, name: ProcessTypeLabels[ProcessType.USER_VERIFICATION] },
  { id: ProcessType.TICKET_VERIFICATION, name: ProcessTypeLabels[ProcessType.TICKET_VERIFICATION] },
  { id: ProcessType.EXTERNAL_DATA, name: ProcessTypeLabels[ProcessType.EXTERNAL_DATA] }
];

export class SingleField {
  name: string;
  id: string;
  fieldType: string;
  repeatingSectionGrid: AppGridsterItem[];
}

export enum ProcessDataType {
  LOGIN = 'LOGIN',
  EXTERNAL = 'EXTERNAL'
}

export class BackgroundDataMap {
  processName: string;
  processType: ProcessType;
  propNames: string[];
}

export class ExternalDataItems {
  additionalPropItems: { [key: string]: AdditionalPropItem };
}
