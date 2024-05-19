import { Component, Input, OnInit } from '@angular/core';
import { OptionItem } from 'src/app/_shared/models/option.model';
import {
  AppProcess,
  AnswerRegisterConfiguration,
  FieldIdentificationTypes,
  AnswerRegisterField,
  SingleField
} from 'src/app/_shared/models/process-of-node.model';
import { CustomContextMenuItem } from 'src/app/_shared/models/custom-context-menu.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { GovRegisterService } from 'src/app/_shared/services/definition-gov-register.service';
import { QuestionField } from 'src/app/_shared/models/question-field.model';
import { ControlContainer, NgForm } from '@angular/forms';
import { getModelDataByArray } from 'src/app/_shared/utils/getModelDataByArray';

@Component({
  selector: 'define-gov-register-process-response',
  templateUrl: './define-gov-register.component.html',
  styleUrls: ['./define-gov-register.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DefineGovRegisterComponent implements OnInit {
  @Input() process: AppProcess = null;

  tabs: OptionItem[] = [];
  fields: { [key: string]: SingleField[] } = {};
  repeatingSectionFields: { [key: string]: OptionItem[] } = {};
  availableTechNames: string[] = [];
  availableFileUploadFields: QuestionField[] = [];
  fieldIdentificationTypes = FieldIdentificationTypes;

  contextMenuItems: CustomContextMenuItem<string>[] = [];

  get registerFields(): AnswerRegisterField[] {
    return this.process.answerRegisterConfiguration.answersRegisterFields;
  }

  get selectedFileInput(): string[] {
    return this.process.answerRegisterConfiguration.fileUploadersTechNames;
  }

  constructor(private formService: FormService, private govRegisterService: GovRegisterService) {}

  ngOnInit() {
    this.prepareTabAndFields();
    if (!this.process.answerRegisterConfiguration?.registerId) {
      this.process.answerRegisterConfiguration = new AnswerRegisterConfiguration();
    }
  }

  handleContextMenuEvent(event) {
    let modifyValueData = getModelDataByArray(event.model.split('.'), this.process.answerRegisterConfiguration);
    modifyValueData.model[modifyValueData.key] = `${modifyValueData.model[modifyValueData.key]}${event.value}`;
  }

  downloadRegisterDefinition() {
    let registerFields: string[] = [];
    this.govRegisterService
      .getRegisterColumns(this.process.answerRegisterConfiguration.registerId)
      .subscribe((registerColumns: string[]) => {
        registerFields = registerColumns;
      })
      .add(() => {
        this.process.answerRegisterConfiguration.answersRegisterFields = registerFields.map((item) => {
          return {
            registerColumnName: item,
            fieldIdentifier: '',
            repeatingSectionFieldsIdentifiers: [],
            blockPresentationData: true,
            fieldIdentificationType: FieldIdentificationTypes.TECHNAME
          };
        });
      });
  }

  private prepareTabAndFields() {
    this.formService.currentFormVersion.tabs.forEach((tab: Tab) => {
      this.fields[tab.id] = tab.questions.map((item: AppGridsterItem) => {
        this.availableTechNames.push(item.field.techName);

        if (item.field.type === FieldTypes.REPEATING_SECTION) {
          this.repeatingSectionFields[item.field.techName] = item.field.repeatingSectionGrid.map(({ field }) => {
            this.availableTechNames.push(field.techName);
            return {
              name: field.techName,
              id: field.id
            };
          });
        }

        if (item.field.type == FieldTypes.FILE_UPLOADER) {
          this.availableFileUploadFields.push(item.field);
          return;
        } else {
          return {
            repeatingSectionGrid: item.field.repeatingSectionGrid || null,
            tabId: tab.id,
            id: item.field.id,
            name: item.field.techName,
            fieldType: item.field.type
          };
        }
      });
      this.fields[tab.id] = this.fields[tab.id].filter(Boolean);
    });
    this.tabs = this.formService.currentFormVersion.tabs
      .filter((tab: Tab) => this.fields[tab.id].length)
      .map((tab: Tab) => {
        return {
          id: tab.id,
          name: tab.title
        };
      });

    this.createContextMenuItems();
  }

  createContextMenuItems() {
    this.contextMenuItems = this.tabs.map((tab) => {
      return {
        label: tab.name,
        subItems: this.fields[tab.id].map((singleField) => {
          if (singleField.fieldType === FieldTypes.REPEATING_SECTION) {
            return {
              label: singleField.name,
              subItems: singleField.repeatingSectionGrid.map(({ field }) => {
                return {
                  label: field.techName,
                  emitValue: `{{${singleField.name}.${field.techName}}}`
                };
              })
            };
          } else {
            return {
              label: singleField.name,
              emitValue: `{{${singleField.name}}}`
            };
          }
        })
      };
    });
  }

  clearChoicesFieldConfiguration(item: AnswerRegisterField) {
    item.repeatingSectionFieldsIdentifiers = [];
    item.fieldIdentifier = '';
    item.blockPresentationData = false;
  }

  onChangeMode(item: AnswerRegisterField) {
    if (item.fieldIdentificationType === FieldIdentificationTypes.SYNTAX) {
      item.fieldIdentificationType = FieldIdentificationTypes.TECHNAME;
    } else if (item.fieldIdentificationType === FieldIdentificationTypes.TECHNAME) {
      item.fieldIdentificationType = FieldIdentificationTypes.SYNTAX;
    }
    this.clearChoicesFieldConfiguration(item);
  }

  toggleClickAddUploadFileInput(item: QuestionField) {
    let selectedFileUploadInputs: string[] = this.process.answerRegisterConfiguration.fileUploadersTechNames;
    if (selectedFileUploadInputs.includes(item.techName)) {
      this.process.answerRegisterConfiguration.fileUploadersTechNames = selectedFileUploadInputs.filter(
        (selectedTechName) => selectedTechName != item.techName
      );
    } else {
      this.process.answerRegisterConfiguration.fileUploadersTechNames.push(item.techName);
    }
  }

  isRepeatingSectionFieldType(availibleFields, filedTechName) {
    if (availibleFields && filedTechName) {
      return availibleFields.find(
        (field) => field.name === filedTechName && field.fieldType === FieldTypes.REPEATING_SECTION
      );
    }
    return false;
  }
}
