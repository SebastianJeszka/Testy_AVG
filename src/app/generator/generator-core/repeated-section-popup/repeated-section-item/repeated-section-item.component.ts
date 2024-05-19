import { EventEmitter, OnChanges } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { AddFieldFormComponent } from 'src/app/generator/add-field-form/add-field-form.component';
import { BIG_POPUP_WIDTH } from 'src/app/_shared/consts';
import { FieldLabels, FieldTypeOptions, FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { QuestionField, RepeatingSectionViewType } from 'src/app/_shared/models/question-field.model';
import { AppGridsterItem } from 'src/app/_shared/models/tab.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { isFieldWithOptions, setDefaultValues } from 'src/app/_shared/utils/add-field-form.utilits';
import { checkIfIdIsUuidV4 } from 'src/app/_shared/utils/check-if-ID-uuid.utilits';
import { countRowsForInput } from 'src/app/_shared/utils/generator-utilits';
import { normalizeString } from 'src/app/_shared/utils/normalize-string.utilits';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'repeated-section-item',
  templateUrl: './repeated-section-item.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class RepeatedSectionItemComponent implements OnInit, OnChanges {
  @Input() item: AppGridsterItem;
  @Input() index: number;
  @Input() repeatingSectionViewType: RepeatingSectionViewType = RepeatingSectionViewType.DEFAULT;

  @Output() removeItem: EventEmitter<string> = new EventEmitter();
  @Output() changedItem: EventEmitter<number> = new EventEmitter();

  fieldTypeLabels = FieldLabels;
  fieldTypesOptions: OptionItem[] = [];
  isFieldHasConstantId: boolean = false;

  constructor(public dialog: MatDialog, private formService: FormService) {}

  get field() {
    return this.item.field;
  }

  get allowTechNameChange(): boolean {
    return this.formService.isAllowedChangeTechName(this.field);
  }

  ngOnInit(): void {
    this.isFieldHasConstantId = checkIfIdIsUuidV4(this.field?.id);
  }

  ngOnChanges() {
    if (this.repeatingSectionViewType === RepeatingSectionViewType.TABLE) {
      this.fieldTypesOptions = FieldTypeOptions.filter((value) =>
        [FieldTypes.TEXT_FIELD, FieldTypes.DATEPICKER, FieldTypes.NUMBER, FieldTypes.SELECT].includes(
          value.id as FieldTypes
        )
      );
    } else {
      this.fieldTypesOptions = FieldTypeOptions;
    }
  }

  onOpenEdition() {
    const dialogRef = this.dialog.open(AddFieldFormComponent, {
      width: BIG_POPUP_WIDTH,
      data: {
        formType: null,
        input: this.field
      }
    });

    dialogRef.afterClosed().subscribe((editedField: QuestionField) => {
      if (editedField) {
        this.item.field = editedField;
        this.changedItem.emit();
      }
    });
  }

  onChangeType() {
    this.item.rows = countRowsForInput(this.item.field);
    if (isFieldWithOptions(this.item.field.type)) {
      setDefaultValues(this.item.field);
    }
    this.item.field.validation.required = this.item.field.type !== FieldTypes.TEXT_BLOCK;
    this.changedItem.emit();
  }

  onChangeTechName() {
    this.field.techName = normalizeString(this.field.techName);
  }
}
