import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import {
  AppProcess,
  ExternalDataConfiguration,
  ExternalDataConfigurationUrlParamsItem,
  ProcessDataType
} from 'src/app/_shared/models/process-of-node.model';

import { OptionItem } from 'src/app/_shared/models/option.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { ProcessConfigService } from 'src/app/_shared/services/process-config.service';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { EXCEPTED_FIELDS_FROM_AUTOCOMPLETE } from 'src/app/_shared/consts';

@Component({
  selector: 'external-data-process',
  templateUrl: './external-data-process.component.html',
  styleUrls: ['./external-data-process.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ExternalDataProcessComponent implements OnInit {
  @Input() process: AppProcess;
  tabs: OptionItem[] = [];
  fields: { [key: string]: OptionItem[] } = {};
  urlParams: string[] = [];
  testResponse: any;
  ProcessDataType = ProcessDataType;
  testRequestError: boolean = false;
  testValuesArray: string[] = [];
  constructor(private formService: FormService, private processConfigService: ProcessConfigService) {}

  ngOnInit(): void {
    this.prepareTabAndFields();
    this.initConfig();
    this.updateUrlParams(false);
  }

  get externalConfigDataMap(): ExternalDataConfiguration {
    return this.process.externalDataConfiguration;
  }

  initConfig(): void {
    if (!this.process.externalDataConfiguration) {
      this.process.externalDataConfiguration = new ExternalDataConfiguration('', [], [], []);
    } else {
      this.process.externalDataConfiguration.urlParams.forEach((item) => {
        Object.entries(this.fields).forEach((el) => {
          el[1].forEach((k) => {
            if (k.name === item.source[0]) {
              item.tabId = k.tabId;
            }
          });
        });
      });
    }
  }

  updateUrlParams(isEdit: boolean): void {
    this.urlParams = this.process.externalDataConfiguration.url
      ? this.process.externalDataConfiguration.url.match(/[^\{\}]+(?=\})/g)
      : [];
    if (!this.urlParams.length) {
      this.process.externalDataConfiguration.urlParams = [];
      this.process.externalDataConfiguration.queryParams = [];
      this.process.externalDataConfiguration.responseMapping = [];
    }
    if (isEdit) {
      this.process.externalDataConfiguration.urlParams = [];
      this.urlParams.forEach((urlParamsItem) => {
        this.process.externalDataConfiguration.urlParams.push(
          new ExternalDataConfigurationUrlParamsItem([''], urlParamsItem, null, '', '')
        );
      });
    }
  }

  executeTestRequest(): void {
    this.accumulateTestValues();
    this.testRequestError = false;
    this.processConfigService
      .testExternalRequest(this.process.externalDataConfiguration.url, this.testValuesArray)
      .subscribe(
        (resp: any) => {
          this.onDataLoaded(resp);
        },
        (error) => {
          JSON.stringify(error) ? ((this.testResponse = JSON.stringify(error)), null, 2) : null;
          this.testRequestError = true;
          setTimeout(() => {
            this.testRequestError = false;
          }, 6000);
        }
      );
  }

  accumulateTestValues(): void {
    this.process.externalDataConfiguration.urlParams.forEach((urlParam) => {
      this.testValuesArray.push(urlParam.testRequestValue);
    });
  }

  onDataLoaded(data): void {
    if (JSON.stringify(data)) {
      this.testResponse = JSON.stringify(data, null, 2);
    }
  }

  onChangePage(item: ExternalDataConfigurationUrlParamsItem): void {
    item.fieldId = '';
  }

  ifFieldIsSelected(fieldValue, indexToCheck): boolean {
    return (
      this.externalConfigDataMap.urlParams.findIndex(
        (item: ExternalDataConfigurationUrlParamsItem, index) => index !== indexToCheck && item.fieldId === fieldValue
      ) > -1
    );
  }

  prepareTabAndFields(): void {
    this.tabs = this.formService.currentFormVersion.tabs.map((tab: Tab) => {
      this.fields[tab.id] = tab.questions
        .filter((item) => !EXCEPTED_FIELDS_FROM_AUTOCOMPLETE.includes(item.field.type as any))
        .map((item: AppGridsterItem) => {
          return {
            tabId: tab.id,
            tabTitle: tab.title,
            id: item.field.id,
            name: item.field.techName
          };
        });
      return {
        id: tab.id,
        name: tab.title
      };
    });
  }
}
