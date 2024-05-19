import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CKEditor4 } from 'ckeditor4-angular';
import { AdditionalValidators } from 'src/app/_shared/models/additional-validators.enum';
import { ckeditorConfig } from 'src/app/_shared/models/ckeditor-config.model';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { AppProcess, EmailFieldMapItem } from 'src/app/_shared/models/process-of-node.model';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { FormService } from 'src/app/_shared/services/form.service';

@Component({
  selector: 'emails-process',
  templateUrl: './emails-process.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class EmailsProcessComponent implements OnInit, OnChanges {
  @Input() process: AppProcess = null;
  @Input() processExecuteTime: 'before' | 'after' = null;
  @Input() disableState: boolean = false;

  tabs: OptionItem[] = [];
  fields: { [key: string]: OptionItem[] } = {};

  ckeditor: CKEditor4.Config = ckeditorConfig();
  activeTabIndex: number = 0;

  emailsDefineTypeChecked: boolean;
  emailsFieldsDefineTypeChecked: boolean;

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.prepareTabAndFields();
  }

  ngOnChanges() {
    if (this.process) {
      this.onEmailsDefineTypeChange();
      this.onEmailsFieldsDefineTypeChange();
    }
  }

  onAddEmail() {
    this.process.emailsDefineProcessData.push('');
  }

  onRemoveEmails(i) {
    this.process.emailsDefineProcessData.splice(i, 1);
  }

  onAddField() {
    const newField = new EmailFieldMapItem();

    if (this.process.emailsFieldsDefineProcessData) {
      this.process.emailsFieldsDefineProcessData.push(newField);
    } else {
      this.process.emailsFieldsDefineProcessData = [newField];
    }
  }

  onRemoveField(i) {
    this.process.emailsFieldsDefineProcessData.splice(i, 1);
  }

  trackByIdx(index: number): number {
    return index;
  }

  ifFieldIsSelected(fieldValue, indexToCheck) {
    return (
      this.process.emailsFieldsDefineProcessData.findIndex(
        (item: EmailFieldMapItem, index) => index !== indexToCheck && item.fieldId === fieldValue
      ) > -1
    );
  }

  onChangePage(item: EmailFieldMapItem) {
    item.fieldId = null;
  }

  onTabIndexChanged(index: number) {
    this.activeTabIndex = index;
  }

  onEmailsDefineTypeChange() {
    this.emailsDefineTypeChecked =
      !!this.process.emailsDefineMessageTypeResults || !!this.process.emailsDefineMessageTypePersonal;
  }

  onEmailsFieldsDefineTypeChange() {
    this.emailsFieldsDefineTypeChecked =
      !!this.process.emailsFieldsDefineMessageTypeResults || !!this.process.emailsFieldsDefineMessageTypePersonal;
  }

  private prepareTabAndFields() {
    this.formService.currentFormVersion.tabs.forEach((tab: Tab) => {
      this.fields[tab.id] = tab.questions
        .filter((item) => item.field.validation?.additionalValidator === AdditionalValidators.EMAIL)
        .map((item: AppGridsterItem) => {
          return {
            id: item.field.id,
            name: item.field.techName
          };
        });
    });

    this.tabs = this.formService.currentFormVersion.tabs
      .filter((tab: Tab) => this.fields[tab.id].length)
      .map((tab: Tab) => {
        return {
          id: tab.id,
          name: tab.title
        };
      });
  }
}
