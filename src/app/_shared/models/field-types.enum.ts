import { FormVersionTypes } from './form-version.model';
import { OptionItem } from './option.model';

export enum FieldTypes {
  TEXT_FIELD = 'TEXT_FIELD',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  TEXTAREA = 'TEXTAREA',
  DATEPICKER = 'DATEPICKER',
  NUMBER = 'NUMBER',
  FILE_UPLOADER = 'FILE_UPLOADER',
  TEXT_BLOCK = 'TEXT_BLOCK',
  REPEATING_SECTION = 'REPEATING_SECTION',
  CONSENT_SECTION = 'CONSENT_SECTION',
  HTML_VIEWER = 'HTML_VIEWER'
}

export const FieldLabels = {
  [FieldTypes.TEXT_FIELD]: 'Pole tekstowe',
  [FieldTypes.SELECT]: 'Lista rozwijana',
  [FieldTypes.RADIO]: 'Pole wyboru radio',
  [FieldTypes.CHECKBOX]: 'Pole wyboru checkbox',
  [FieldTypes.TEXTAREA]: 'Textarea',
  [FieldTypes.DATEPICKER]: 'Datepicker',
  [FieldTypes.NUMBER]: 'Pole numeryczne',
  [FieldTypes.FILE_UPLOADER]: 'Przesyłanie plików',
  [FieldTypes.TEXT_BLOCK]: 'Blok tekstu',
  [FieldTypes.REPEATING_SECTION]: 'Sekcja powtarzalna',
  [FieldTypes.CONSENT_SECTION]: 'Sekcja zgód',
  [FieldTypes.HTML_VIEWER]: 'Podgląd HTML'
};

export const FieldTypeOptions: OptionItem[] = [
  {
    id: FieldTypes.TEXT_FIELD,
    name: FieldLabels[FieldTypes.TEXT_FIELD],
    excluded: [FormVersionTypes.SERVICE]
  },
  {
    id: FieldTypes.SELECT,
    name: FieldLabels[FieldTypes.SELECT],
    excluded: [FormVersionTypes.SERVICE]
  },
  {
    id: FieldTypes.RADIO,
    name: FieldLabels[FieldTypes.RADIO],
    excluded: [FormVersionTypes.SERVICE]
  },
  {
    id: FieldTypes.CHECKBOX,
    name: FieldLabels[FieldTypes.CHECKBOX],
    excluded: [FormVersionTypes.SERVICE]
  },
  {
    id: FieldTypes.TEXTAREA,
    name: FieldLabels[FieldTypes.TEXTAREA],
    excluded: [FormVersionTypes.SERVICE]
  },
  {
    id: FieldTypes.DATEPICKER,
    name: FieldLabels[FieldTypes.DATEPICKER],
    excluded: [FormVersionTypes.SERVICE]
  },
  {
    id: FieldTypes.NUMBER,
    name: FieldLabels[FieldTypes.NUMBER],
    excluded: [FormVersionTypes.SERVICE]
  },
  {
    id: FieldTypes.FILE_UPLOADER,
    name: FieldLabels[FieldTypes.FILE_UPLOADER]
  },
  {
    id: FieldTypes.CONSENT_SECTION,
    name: FieldLabels[FieldTypes.CONSENT_SECTION],
    excluded: [FormVersionTypes.SERVICE]
  },
  {
    id: FieldTypes.TEXT_BLOCK,
    name: FieldLabels[FieldTypes.TEXT_BLOCK]
  },
  {
    id: FieldTypes.HTML_VIEWER,
    name: FieldLabels[FieldTypes.HTML_VIEWER]
  }
];
