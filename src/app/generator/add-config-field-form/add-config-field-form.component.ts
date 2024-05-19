import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { QuestionField } from 'src/app/_shared/models/question-field.model';
import { ServiceConfigAttribute, ServiceConfigDictionary } from 'src/app/_shared/models/service-config.model';

@Component({
  selector: 'add-config-field-form',
  templateUrl: './add-config-field-form.component.html',
  styleUrls: ['./add-config-field-form.component.scss']
})
export class AddConfigFieldFormComponent {
  public attributeList: ServiceConfigAttribute[] = [];
  public selectedAttribute: ServiceConfigAttribute;
  public dictionaries: ServiceConfigDictionary[];
  field: QuestionField = new QuestionField();

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddConfigFieldFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      formType: FormVersionTypes;
      attributes: ServiceConfigAttribute[];
      dictionaries: ServiceConfigDictionary[];
    }
  ) {
    this.attributeList = data.attributes;
    this.dictionaries = data.dictionaries;
  }

  selectAttribute(attribute: ServiceConfigAttribute) {
    this.selectedAttribute = attribute;
  }

  closeAddField() {
    this.dialogRef.close();
  }

  saveField() {
    this.field.techName = this.selectedAttribute.techName;
    this.field.dictionaryName = this.selectedAttribute.dictionaryTechNameType;
    this.field.type = this.selectedAttribute.fieldType;
    this.field.validation = this.selectedAttribute.validation;
    this.field.title = this.selectedAttribute.name;
    this.field.readOnly = this.selectedAttribute.readOnly;

    if (this.selectedAttribute.dictionaryTechNameType) {
      let dictionary = this.dictionaries.find(
        (dictionary) => dictionary.techName === this.selectedAttribute.dictionaryTechNameType
      );

      if (dictionary) {
        dictionary.items.forEach((dictionaryItem, index) => {
          if (!this.field.options?.length) this.field.options = [];
          this.field.options.push({
            id: index.toString(),
            name: dictionaryItem.value,
            checked: false
          });
        });
      }

      this.field.dictionaryName = null;
    }

    this.field.isConfig = true;

    this.dialogRef.close(this.field);
  }
}
