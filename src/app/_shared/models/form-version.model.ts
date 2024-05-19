import { GraphNode } from './graph-node.model';
import { LinkEdge } from './link-edge.model';
import { NavigationStep } from './stepper.model';
import { Tab } from './tab.model';

export class FormVersionBase {
  allFieldTechNames: string[] = [];
  createDate: Date;
  description: string = null;
  formId: string = null;
  id: string = null;
  name: string = null;
  readyToPublishDate: Date | null;
  redactorId: string;
  redactorName: string;
  state: FormVersionState = FormVersionState.SKETCH;
  title: string = null;
  type: FormVersionTypes = FormVersionTypes.FORM;
  registrationConfirmationType: RegistrationConfirmationType = RegistrationConfirmationType.VIA_EMAIL;
  versionMajor: number;
  versionMinor: number;
  linksAdded: boolean = false;
}

export class FormVersionFull extends FormVersionBase {
  editDate: Date;
  enableNavigation: boolean = false;
  enableSummaryStep: boolean = false;
  flow: FormVersionFlow = new FormVersionFlow();
  tabs: Tab[] = [];
  sketchCreated: boolean;
  navigationSteps: NavigationStep[] = [];
  available: boolean = true;
  summaryHtmlTemplate?: string = '';
  serviceId: string;
  serviceStageId: string;
  serviceVersionId: string;

  constructor(tabs?: Tab[]) {
    super();
    this.tabs = tabs ? tabs : [];
  }
}

export class FormVersionTestConfig {
  allFieldTechNames?: string[];
  createDate?: Date;
  description?: string;
  formId?: string;
  id?: string;
  name?: string;
  readyToPublishDate?: Date | null;
  redactorId?: string;
  redactorName?: string;
  state?: FormVersionState;
  title?: string;
  type?: FormVersionTypes;
  registrationConfirmationType?: RegistrationConfirmationType;
  versionMajor?: number;
  versionMinor?: number;
  linksAdded?: boolean;
  editDate?: Date;
  enableNavigation?: boolean;
  enableSummaryStep?: boolean;
  flow?: FormVersionFlow;
  tabs?: Tab[];
  sketchCreated?: boolean;
  navigationSteps?: NavigationStep[];
  available?: boolean;
  summaryHtmlTemplate?: string;
}

export enum FormVersionState {
  SKETCH = 'SKETCH',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED'
}

export const FormVersionStateLabels = {
  [FormVersionState.SKETCH]: 'Szkic',
  [FormVersionState.PENDING]: 'Gotowy do publikacji',
  [FormVersionState.PUBLISHED]: 'Opublikowany',
  [FormVersionState.ARCHIVED]: 'Archiwalny',
  [FormVersionState.BLOCKED]: 'Zablokowany'
};

export enum FormVersionTypes {
  FORM = 'FORM',
  QUIZ = 'QUIZ',
  REGISTRATION = 'REGISTRATION',
  TEMPLATE = 'TEMPLATE',
  SERVICE = 'SERVICE'
}

export const FormVersionTypeLabels = {
  [FormVersionTypes.FORM]: 'Ankieta',
  [FormVersionTypes.QUIZ]: 'Quiz',
  [FormVersionTypes.REGISTRATION]: 'Rejestracja dostępu',
  [FormVersionTypes.TEMPLATE]: 'Szablon',
  [FormVersionTypes.SERVICE]: 'Usługa'
};

export class FormVersionFlow {
  nodes: GraphNode[] = [];
  links: LinkEdge[] = [];
}

export enum GraphValidationMessage {
  NO_LINKS_ADDED = 'Nie dodano żadnego przejścia między stronami',
  NOT_EVERY_NODE_CONNECTED_WITTH_LINKS = 'Nie wszystkie strony zostały połączone przejściami',
  START_PAGE_CANNOT_BE_COPY = 'Strona początkowa grafa nie może być kopią',
  ONLY_ONE_START_PAGE_SHOULD_EXIST = 'Powinna istnieć tylko jedna strona startowa',
  AT_LEAST_ONE_END_PAGE_SHOULD_EXIST = 'Powinna istnieć co najmniej jedna strona końcowa'
}

export enum RegistrationConfirmationType {
  VIA_EMAIL = 'VIA_EMAIL',
  VIA_PZ = 'VIA_PZ'
}

export const RegistrationConfirmationTypeLabels = {
  [RegistrationConfirmationType.VIA_EMAIL]: 'przez e-mail',
  [RegistrationConfirmationType.VIA_PZ]: 'przez Profil Zaufany'
};
