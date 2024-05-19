import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { QuestionField, MoveQuestion, ConfirmationConfig } from 'src/app/_shared/models/question-field.model';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { BIG_POPUP_WIDTH } from 'src/app/_shared/consts';
import { AddFieldFormComponent } from '../add-field-form/add-field-form.component';
import { countColsForRepeatingSection, countRowsForInput } from '../../_shared/utils/generator-utilits';
import { RepeatedSectionPopupComponent } from '../generator-core/repeated-section-popup/repeated-section.component';
import { AppGridsterItem } from 'src/app/_shared/models/tab.model';
import { DictionaryExternalConfig } from 'src/app/_shared/models/dictionary-external-config.model';
import { DictionaryConfigService } from 'src/app/_shared/services/dictionary-config.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'question-field',
  templateUrl: './question-field.component.html',
  styleUrls: ['./question-field.component.scss']
})
export class QuestionFieldComponent implements OnChanges {
  @Input() item: AppGridsterItem;
  @Input() index: number;
  @Input() type: FormVersionTypes;
  @Input() tabs: string[] = [];
  @Input() currentTab: number = null;
  @Input() hideSettings: boolean = false;

  @Output() removeItem: EventEmitter<number> = new EventEmitter();
  @Output() moveItem: EventEmitter<MoveQuestion> = new EventEmitter();
  @Output() fieldChange: EventEmitter<AppGridsterItem> = new EventEmitter();

  field: QuestionField;

  types = FieldTypes;
  formVersionTypes = FormVersionTypes;

  testVal: any = null;

  optionsLevels: OptionItem[][] = [];
  externalConfigLevels: OptionItem[][] = [];

  optionsAnswers: { [key: number]: any } = {};

  constructor(public dialog: MatDialog, public externalDictionaryService: DictionaryConfigService) {}

  get validation() {
    return this.field.validation;
  }

  ngOnChanges() {
    this.field = this.item.field;
    if (!this.field.confirmation) {
      this.field.confirmation = new ConfirmationConfig();
    }
    if (this.field.dictionaryExternalConfig) {
      const { sourceUrl, labelPropertyName, valuePropertyName, paramPropertyName } =
        this.field.dictionaryExternalConfig;
      this.externalDictionaryService
        .getOptionsFromExternalApi(sourceUrl, labelPropertyName, valuePropertyName, paramPropertyName)
        .subscribe((options: any[]) => {
          this.externalConfigLevels.push(options);
        });
    }
  }

  onMoveQuestion(iTab) {
    this.moveItem.emit({
      question: this.item,
      toTab: iTab,
      questionIndex: this.index
    });
  }

  onModelChange(e: OptionItem, levelIndex) {
    if (this.optionsLevels[levelIndex]) {
      this.optionsLevels.splice(levelIndex);
    }
    if (e.children?.length) {
      this.optionsLevels.splice(levelIndex, 0, e.children);
      if (this.item.rows < 2 && this.optionsLevels?.length > 0) {
        this.item.rows = 2;
        this.fieldChange.emit(this.item);
      }
    }

    this.optionsAnswers[levelIndex + 1] = '';
    if (Object.keys(this.optionsAnswers).length > levelIndex + 1) {
      Object.keys(this.optionsAnswers).forEach((i) => {
        if (i > levelIndex + 1) {
          this.optionsAnswers[i] = '';
        }
      });
    }
  }

  getTitleFromLevelsData(dictLevel: number = 0) {
    return (
      (this.field.dictionaryLevelsData &&
        this.field.dictionaryLevelsData[dictLevel] &&
        this.field.dictionaryLevelsData[dictLevel].title) ||
      ''
    );
  }

  getPlaceholderFromLevelsData(dictLevel: number = 0) {
    return (
      (this.field.dictionaryLevelsData &&
        this.field.dictionaryLevelsData[dictLevel] &&
        this.field.dictionaryLevelsData[dictLevel].placeholder) ||
      ''
    );
  }

  getConfigFromLevel(config: DictionaryExternalConfig, dictLevel: number) {
    return dictLevel === 0 ? config : this.getConfigFromLevel(config.childConfig, dictLevel - 1);
  }

  getUrlWithParams(config: DictionaryExternalConfig) {
    return config.urlParams.reduce(
      (accumulator, currentParam) =>
        accumulator.includes(currentParam.paramName)
          ? accumulator.replace(`{${currentParam.paramName}}`, this.optionsAnswers[currentParam.dictLevel].param)
          : accumulator,
      config.sourceUrl
    );
  }

  onExternalDictModelChange(dictLevel: number) {
    const childConfigCopy: DictionaryExternalConfig = JSON.parse(
      JSON.stringify(this.getConfigFromLevel(this.field.dictionaryExternalConfig, dictLevel + 1))
    );

    if (childConfigCopy && !this.field.multiple) {
      const sourceUrl = childConfigCopy.urlParams.length
        ? this.getUrlWithParams(childConfigCopy)
        : childConfigCopy.sourceUrl;

      this.externalDictionaryService
        .getOptionsFromExternalApi(
          sourceUrl,
          childConfigCopy.labelPropertyName,
          childConfigCopy.valuePropertyName,
          childConfigCopy.paramPropertyName
        )
        .subscribe((options: any[]) => {
          this.externalConfigLevels[dictLevel + 1] = options;
        });
    }
    this.externalConfigLevels = this.externalConfigLevels.slice(0, dictLevel + 2);
  }

  onOpenEdition() {
    const dialogRef = this.dialog.open(AddFieldFormComponent, {
      width: BIG_POPUP_WIDTH,
      data: {
        formType: this.type,
        input: this.item.field
      }
    });

    dialogRef.afterClosed().subscribe((field) => {
      this.onFieldEdited(field);
    });
  }

  onEditRepeatingSection() {
    const dialogRef = this.dialog.open(RepeatedSectionPopupComponent, {
      width: BIG_POPUP_WIDTH,
      data: {
        formType: this.type,
        input: this.item.field
      }
    });

    dialogRef.afterClosed().subscribe((field) => {
      if (field) {
        this.onRepeatingSectionEdited(field);
      }
    });
  }

  onFieldEdited(field: QuestionField) {
    if (field) {
      this.item.field = field;
      const rowsForInput =
        field.type === FieldTypes.CONSENT_SECTION && this.item.rows
          ? this.item.rows
          : countRowsForInput(this.item.field);
      this.item.rows = rowsForInput;
      this.item.minItemRows = field.type === FieldTypes.CONSENT_SECTION ? 1 : rowsForInput;
      this.fieldChange.emit(this.item);
    }
  }

  onRepeatingSectionEdited(field: QuestionField) {
    if (field && field.type === FieldTypes.REPEATING_SECTION) {
      this.item.field = field;
      this.item.cols = field.repeatingSectionConfig.cols || countColsForRepeatingSection(field);
      this.item.rows = field.repeatingSectionConfig.rows;
      this.item.minItemRows = field.repeatingSectionConfig.rows;
      this.fieldChange.emit(this.item);
    }
  }

  onRemoveRepeatingSection() {
    this.removeItem.emit(this.index);
  }

  minDateForDatePicker() {
    return this.validation.minDate ? this.validation.minDate : this.validation.dateFromNow ? new Date() : null;
  }

  maxDateForDatePicker() {
    return this.validation.maxDate ? this.validation.maxDate : this.validation.dateUntilNow ? new Date() : null;
  }
}
