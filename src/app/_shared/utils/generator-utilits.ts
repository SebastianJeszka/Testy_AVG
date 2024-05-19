import { FieldTypes } from '../models/field-types.enum';
import { QuestionField } from '../models/question-field.model';
import { AppGridsterItem } from '../models/tab.model';

export function countRowsForInput(input: QuestionField) {
  const itemsPerRow = 5;
  if (input.type === FieldTypes.RADIO || input.type === FieldTypes.CHECKBOX) {
    const optionsLength = input.options.length;
    if (optionsLength > 3 && optionsLength < 10) {
      return 2;
    } else {
      return Math.ceil((optionsLength - 3) / itemsPerRow) + 1;
    }
  } else if (input.type === FieldTypes.SELECT && input.multiLevelTree) {
    return 2;
  } else if (input.type === FieldTypes.FILE_UPLOADER || input.type === FieldTypes.HTML_VIEWER) {
    return 2;
  } else if (input.confirmation.isRequired) {
    return 2;
  } else {
    return 1;
  }
}

export function countColsForRepeatingSection(input: QuestionField) {
  if (input.type === FieldTypes.REPEATING_SECTION && input.repeatingSectionGrid) {
    let maxCols = 0;
    input.repeatingSectionGrid.forEach((item: AppGridsterItem) => {
      let takesColumns = item.x + item.cols;
      maxCols = maxCols < takesColumns ? takesColumns : maxCols;
    });
    return maxCols;
  }
  return 1;
}
