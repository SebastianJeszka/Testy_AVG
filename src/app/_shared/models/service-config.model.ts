import { FieldTypes } from './field-types.enum';
import { FieldValidations } from './question-field.model';

export class ServiceConfig {
  id: string;
  createDate: Date;
  editDate: Date;
  type: string;
  serviceCharterId: string;
  currentServiceVersion: ServiceConfigVersion;
  name?: string;
}

export class ServiceConfigVersion {
  id: string;
  createDate: Date;
  editDate: Date;
  description: string;
  status: string;
  dictionaries: ServiceConfigDictionary[];
  attributes: ServiceConfigAttribute[];
  serviceStages: ServiceConfigStep[];
}

export class ServiceConfigDictionary {
  name: string;
  techName: string;
  items: ServiceConfigDictionaryItem[];
}

export class ServiceConfigDictionaryItem {
  value: string;
}

export class ServiceConfigAttribute {
  name: string;
  techName: string;
  fieldType: FieldTypes;
  dictionaryTechNameType: string;
  dictionaryName: string;
  options: AttributeOption[];
  validation: FieldValidations;
  multiple: boolean;
  readOnly: boolean;
  consentSectionConfig: ConsentSectionConfig;
}

export class ConsentSectionConfig {
  consents: Consent[];
  files: File[];
  selectAllEnabled: boolean;
}

export class Consent {
  description: string;
  required: boolean;
}

export class File {
  businessId: string;
  name: string;
  size: number;
  url: string;
}

export class AttributeOption {
  id: string;
  name: string;
  isAnswer: boolean;
  children: string[];
  ifShowInput: boolean;
}

export class ServiceConfigStep {
  id: string;
  formId: string;
  formVersionId: string;
  institutionTypeIds: string[];
  index: number;
  serviceStageAttributes: ServiceStageAttribute[];
  label: string;
}

export class ServiceStageAttribute {
  attributeTechName: string;
  readOnly: boolean;
  valueFromServiceStageId: string;
}
