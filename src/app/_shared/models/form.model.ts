import { FormVersionTypes } from './form-version.model';

export class Form {
  id: string = null;
  createDate: Date;
  editDate: Date;
  name: string = null;
  redactorId: string;
  redactorName: string;
  state: FormState = FormState.SKETCH;
  type: FormVersionTypes = FormVersionTypes.FORM;
  visibleInTab: FormCategory = FormCategory.ACTIVE;
  occupied: boolean;
  disabled: boolean;
}

export enum FormCategory {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum FormState {
  SKETCH = 'SKETCH',
  PENDING = 'PENDING',
  DELETED = 'DELETED'
}

export const FormStateLabels = {
  [FormState.SKETCH]: 'Nieopublikowany',
  [FormState.PENDING]: 'Gotowy do publikacji',
  [FormState.DELETED]: 'Usunięty'
};
