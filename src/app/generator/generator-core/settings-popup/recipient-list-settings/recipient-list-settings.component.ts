import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { ThemePalette } from '@angular/material/core';
import {
  AdditionalPropItem,
  BackgroundDataContextMenuItem,
  RecipientListItem,
  RegisteredExternalApis,
  SendingResultsConfig
} from 'src/app/_shared/models/sending-results.model';
import { ReportConfigService } from 'src/app/_shared/services/reports-config.service';
import { FormVersionFull } from 'src/app/_shared/models/form-version.model';
import { ProcessConfigService } from 'src/app/_shared/services/process-config.service';
import { BackgroundDataProp } from 'src/app/_shared/models/sending-results.model';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { EXCEPTED_FIELDS_FROM_AUTOCOMPLETE } from 'src/app/_shared/consts';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { Option } from 'src/app/external-modules/query-builder/query-builder.interfaces';
@Component({
  selector: 'recipient-list-settings',
  templateUrl: './recipient-list-settings.component.html',
  styleUrls: ['./recipient-list-settings.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class RecipientListSetingsComponent implements OnInit {
  @Input() sendingResultsConfig: SendingResultsConfig;
  @Input() formVersion: FormVersionFull;

  tabs: OptionItem[] = [];
  fields: { [key: string]: OptionItem[] } = {};
  recipientsItems: OptionItem[] = [];
  color: ThemePalette = 'primary';
  registeredExternalApiMappingData: AdditionalPropItem[] = [];
  registeredExternalApiIds: OptionItem[] = [];
  techNames: OptionItem[] = [];
  isDisplayBackgroundDataMenu: boolean = false;
  backgroundDataMenuItems: BackgroundDataContextMenuItem[] = [];
  backgroundDataProps: BackgroundDataProp[] = [];
  backgroundDataMenuPositionX: number;
  backgroundDataMenuPositionY: number;
  contextTechnameMenuData = [];
  activeKey: '';
  activeRegisteredExternalApiId = '';
  allProcesses: string[] = [];
  recipientsList: any[] = [];
  constructor(
    private formService: FormService,
    private reportConfigService: ReportConfigService,
    private processConfigService: ProcessConfigService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.reportConfigService
      .getRecipientsList()
      .subscribe((resp: RecipientListItem[]) => {
        this.recipientsItems = resp;
        this.recipientsItems.splice(0, 0, { id: '', name: '', params: [] });
      })

    this.initSelectedRecipients();
    this.prepareTabAndFields();
    this.prepareBackgroundMenuItems();
    this.prepareConfigRows();
    this.allProcesses = this.formService.getAllProcessesTechNames();
  }

  getBackgroundDataPlaceholder(): string {
    return this.allProcesses.length ? `Wybierz referencję danych z procesu` : `brak procesów w formularzu`;
  }

  initSelectedRecipients(): void {
    this.sendingResultsConfig.registeredExternalApis.forEach((item) => {
      this.recipientsList.push(item.registeredExternalApiId);
    });
  }

  prepareBackgroundMenuItems(): void {
    let arr = [];
    const contextMenuItemsWithAllTechNames = this.formService.getContextMenuItemsWithAllTechNames();
    contextMenuItemsWithAllTechNames[1]?.subItems
      .filter((element) => element.subItems.length)
      .map((tab) => {
        arr.push({
          tabName: tab.label,
          processes: tab.subItems.map((process) => ({
            techName: process.label,
            processType: process.processType,
            backgroundData: this.processConfigService.backgroundProcessesDataSufixMap.map((subItem) => ({
              backgroundDataProp:
                subItem.processType === process.processType
                  ? subItem.propNames.map((prop) => ({
                      techName: process.label,
                      processType: process.processType,
                      displayName: `{{${prop}}}`,
                      propName: `${process.label}-${prop}`
                    }))
                  : []
            }))
          }))
        });
      });
    this.backgroundDataMenuItems = arr;
    this.accumulateAllBackgroundDataProps();
  }

  accumulateAllBackgroundDataProps(): void {
    let propArray: BackgroundDataProp[] = [];
    this.backgroundDataMenuItems.forEach((item) => {
      Object.keys(item.processes).forEach((typeKey: string) => {
        Object.keys(item.processes[typeKey]).map((propKey: string) => {
          let elem = item.processes[typeKey][propKey];
          Object.keys(elem).forEach((k) => {
            Object.keys(elem[k]).map(() => {
              if (elem[k]['backgroundDataProp']) {
                propArray.push(elem[k]['backgroundDataProp']);
              }
            });
          });
        });
      });
    });

    this.backgroundDataProps = [].concat(...propArray);
  }

  prepareConfigRows(): void {
    let data: RegisteredExternalApis[] = this.sendingResultsConfig.registeredExternalApis;
    if (data)
      data.forEach((item) => {
        Object.entries(item.registeredExternalApiMapping).forEach((elem) => {
          if (elem[1].backgroundDataField)
            elem[1].backgroundDataField = this.getDisplayNameFromPropName(elem[1].backgroundDataField);
        });
      });
  }

  getPropNameFromDisplayName(validation: boolean, propDisplayName: string): string {
    let i = this.backgroundDataProps?.findIndex((item: BackgroundDataProp) => item.displayName === propDisplayName);
    if (i > -1) {
      return this.backgroundDataProps[i]?.propName;
    } else {
      propDisplayName !== '' && validation
        ? this.snackBar.open(`${propDisplayName} : brak referencji do danych z procesu`)
        : null;
      return propDisplayName;
    }
  }

  getDisplayNameFromPropName(propName: string): string {
    let i = this.backgroundDataProps?.findIndex((item: BackgroundDataProp) => item.propName === propName);
    return i > -1 ? this.backgroundDataProps[i]?.displayName : propName;
  }

  onRecipientsChanged(id): void {
    this.recipientsItems.map((elem: RecipientListItem) => {
      if (elem.id === id && this.recipientsList.includes(id)) {
        let registeredExternalApiMapping = {};
        elem.params.forEach((item) => {
          registeredExternalApiMapping = Object.assign(registeredExternalApiMapping, {
            [item]: new AdditionalPropItem('', item, false, '', '')
          });
        });
        Object.keys(registeredExternalApiMapping).length
          ? this.sendingResultsConfig.registeredExternalApis.push(
              new RegisteredExternalApis(elem.id, registeredExternalApiMapping)
            )
          : this.sendingResultsConfig.registeredExternalApis.push(new RegisteredExternalApis(elem.id, {}));
      } else if (!this.recipientsList.includes(id)) {
        const index = this.sendingResultsConfig.registeredExternalApis.findIndex(
          (el) => el.registeredExternalApiId === id
        );
        if (index >= 0) this.sendingResultsConfig.registeredExternalApis.splice(index, 1);
      }
    });
  }

  onChangePage(item: AdditionalPropItem): void {
    item.fieldId = '';
  }

  onSliderChangeFieldReference(item): void {
    item.backgroundData = !item.backgroundData;
    if (item.backgroundData) {
      item.tabId = '';
      item.fieldId = '';
    } else {
      item.backgroundDataField = '';
    }
  }

  displayContextMenu(event, id, key): void {
    this.activeRegisteredExternalApiId = id;
    this.activeKey = key;
    this.isDisplayBackgroundDataMenu = true;
    this.backgroundDataMenuPositionX = event.clientX;
    this.backgroundDataMenuPositionY = event.clientY;
  }

  getBackgroundDataMenuStyle(): { position: string; zIndex: string; left: string; top: string } {
    return {
      position: 'fixed',
      zIndex: '10000',
      left: `${this.backgroundDataMenuPositionX}px`,
      top: `${this.backgroundDataMenuPositionY}px`
    };
  }

  handleMenuItemClick($event): void {
    this.sendingResultsConfig.registeredExternalApis.find(
      (item) => item.registeredExternalApiId === this.activeRegisteredExternalApiId
    ).registeredExternalApiMapping[this.activeKey].backgroundDataField = $event.target.innerText;
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayBackgroundDataMenu = false;
  }

  prepareTabAndFields(): void {
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
}
