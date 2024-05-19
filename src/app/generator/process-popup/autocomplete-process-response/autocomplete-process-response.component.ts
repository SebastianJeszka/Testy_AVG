import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { OptionItem } from 'src/app/_shared/models/option.model';
import {
  AppProcess,
  ExternalDataConfigurationItem,
  ProcessAutocompleteMapItem,
  ProcessDataType
} from 'src/app/_shared/models/process-of-node.model';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { ProcessConfigService } from 'src/app/_shared/services/process-config.service';
const EXCEPTED_FIELDS_FROM_AUTOCOMPLETE = [
  FieldTypes.CONSENT_SECTION,
  FieldTypes.TEXT_BLOCK,
  FieldTypes.FILE_UPLOADER,
  FieldTypes.REPEATING_SECTION
];

@Component({
  selector: 'autocomplete-process-response',
  templateUrl: './autocomplete-process-response.component.html',
  styleUrls: ['./autocomplete-process-response.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AutocompleteProcessResponseComponent implements OnInit {
  @Input() process: AppProcess;
  @Input() disableState: boolean = false;
  @Input() processDataType: ProcessDataType;
  disableAddButton: boolean = false;
  tabs: OptionItem[] = [];
  fields: { [key: string]: OptionItem[] } = {};
  respMaps: { [key: string]: OptionItem[] } = {};
  ProcessDataType = ProcessDataType;
  constructor(private formService: FormService, private processConfig: ProcessConfigService) {}

  ngOnInit(): void {
    this.prepareTabAndFields();
    if (this.processDataType === ProcessDataType.LOGIN) {
      this.handleResponseMapsData(this.processConfig.responseMap);
    }
    if (!this.process.externalAutocompleteMap) {
      this.process.externalAutocompleteMap = [];
    }
  }
  get autocompleteMap() {
    if (this.processDataType === ProcessDataType.LOGIN) {
      return this.process.autocompleteMap;
    } else {
      return this.process.externalAutocompleteMap;
    }
  }

  handleResponseMapsData(respMaps: { [key: string]: { [key: string]: string } }) {
    let transformedMaps = {};
    Object.keys(respMaps).forEach((typeKey: string) => {
      transformedMaps[typeKey] = Object.keys(respMaps[typeKey]).map((propKey: string) => {
        return {
          id: propKey,
          name: respMaps[typeKey][propKey]
        };
      });
    });
    this.respMaps = transformedMaps;
  }

  prepareTabAndFields() {
    this.tabs = this.formService.currentFormVersion.tabs.map((tab: Tab) => {
      this.fields[tab.id] = tab.questions
        .filter((item) => !EXCEPTED_FIELDS_FROM_AUTOCOMPLETE.includes(item.field.type as any))
        .map((item: AppGridsterItem) => {
          return {
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

  onAddField() {
    this.autocompleteMap.push(new ProcessAutocompleteMapItem());
  }

  onRemoveField(i) {
    this.autocompleteMap.splice(i, 1);
  }

  onRemoveAllFields() {
    this.autocompleteMap.forEach((v, i) => {
      this.onRemoveField(i);
    });
  }

  onChangePage(item: ProcessAutocompleteMapItem) {
    item.fieldId = null;
  }

  ifMapPropIsSelected(propertyValue, indexToCheck): boolean {
    return (
      this.autocompleteMap.findIndex(
        (item: ProcessAutocompleteMapItem, index) => index !== indexToCheck && item.responseProperty === propertyValue
      ) > -1
    );
  }

  ifFieldIsSelected(fieldValue, indexToCheck) {
    return (
      this.autocompleteMap.findIndex(
        (item: ProcessAutocompleteMapItem, index) => index !== indexToCheck && item.fieldId === fieldValue
      ) > -1
    );
  }

  onSetExternalDataResponseMapping(i: string, value: string): void {
    this.autocompleteMap.forEach((item) => {
      if (
        this.process.externalDataConfiguration.responseMapping[i].source &&
        this.process.externalDataConfiguration.responseMapping[i].target
      ) {
        this.process.externalDataConfiguration.responseMapping[i].source[0] = value;
        this.process.externalDataConfiguration.responseMapping[i].target = value;
      } else {
        this.process.externalDataConfiguration.responseMapping.push(
          new ExternalDataConfigurationItem([item.responseProperty], item.responseProperty, null)
        );
      }
    });
  }
}
