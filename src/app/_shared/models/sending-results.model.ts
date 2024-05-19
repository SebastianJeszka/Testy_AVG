import { OptionItem } from './option.model';
import { ProcessType } from './process-of-node.model';

export class SendingResultsConfig {
  formVersionId: string;
  frequencyType: ReportFrequencyType;
  scopeType: ReportScopeType;
  sendingTime: string; // e.g.: "14:52"
  recipientEmails: string[] = [];
  zipEnabled: boolean = true;
  enabled: boolean;
  registeredExternalApis: RegisteredExternalApis[] = [];
}

export class RegisteredExternalApis {
  constructor(
    public registeredExternalApiId: string = '',
    public registeredExternalApiMapping: { [key: string]: AdditionalPropItem }
  ) {}
}

export enum ReportFrequencyType {
  DAILY = 'DAILY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY'
}

export const frequencyTypeLabels: OptionItem[] = [
  { id: ReportFrequencyType.DAILY, name: 'CODZIENNIE' },
  { id: ReportFrequencyType.MONDAY, name: 'PONIEDZIAŁEK' },
  { id: ReportFrequencyType.TUESDAY, name: 'WTOREK' },
  { id: ReportFrequencyType.WEDNESDAY, name: 'ŚRODA' },
  { id: ReportFrequencyType.THURSDAY, name: 'CZWARTEK' },
  { id: ReportFrequencyType.FRIDAY, name: 'PIĄTEK' }
];

export enum ReportScopeType {
  DIFFERENTIAL = 'DIFFERENTIAL',
  ALL_DATA = 'ALL_DATA'
}

export class RecipientListItem {
  id: string;
  name: string;
  params: string[];
}

export class AdditionalPropItem {
  constructor(
    public backgroundDataField: string = '',
    public externalMapField: string = '',
    public backgroundData: boolean = false,
    public fieldId: string = '',
    public tabId: string = ''
  ) {}
}

export class BackgroundDataContextMenuItem {
  tabName: string;
  processes: BackgroundDataProcesses[] = [];
}

export class BackgroundDataProcesses {
  techName: string;
  processType: ProcessType;
  backgroundData: BackgroundData[] = [];
}

export class BackgroundData {
  backgroundDataProp: BackgroundDataProp[] = [];
}
export class BackgroundDataProp {
  techName: string;
  processType: ProcessType;
  displayName: string;
  propName: string;
}
