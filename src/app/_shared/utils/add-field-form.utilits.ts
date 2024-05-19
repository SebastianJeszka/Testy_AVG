import { FieldTypes } from '../models/field-types.enum';
import { QuestionField } from '../models/question-field.model';

export function setDefaultValues(field: QuestionField) {
  if (field.type === FieldTypes.SELECT) {
    field.returnOnlySelectedOptions = true;
  } else {
    field.returnOnlySelectedOptions = false;
  }
}

export function isFieldWithOptions(type: FieldTypes | string) {
  return type === FieldTypes.RADIO || type === FieldTypes.SELECT || type === FieldTypes.CHECKBOX;
}
