import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { FormVersionFull, FormVersionState } from 'src/app/_shared/models/form-version.model';
import {
  AdditionalPropItem,
  frequencyTypeLabels,
  ReportScopeType,
  SendingResultsConfig
} from 'src/app/_shared/models/sending-results.model';
import { ReportConfigService } from 'src/app/_shared/services/reports-config.service';
import { RecipientListSetingsComponent } from '../recipient-list-settings/recipient-list-settings.component';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'sending-results',
  templateUrl: './sending-results.component.html'
})
export class SendingResultsComponent implements OnInit {
  @Input() formVersion: FormVersionFull;

  sendingResultsConfig: SendingResultsConfig = new SendingResultsConfig();
  frequencyTypesOptions: OptionItem[] = frequencyTypeLabels;
  reportScopeTypes = ReportScopeType;
  formVersionState = FormVersionState;
  @ViewChild(RecipientListSetingsComponent)
  recipientListSetingsComponent: RecipientListSetingsComponent;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private reportsService: ReportConfigService) {}

  ngOnInit(): void {
    this.getSendingReportsConf();
  }

  getSendingReportsConf() {
    if (this.formVersion.id) {
      this.reportsService.getReportsConfig(this.formVersion).subscribe((resp: SendingResultsConfig) => {
        this.sendingResultsConfig = resp ? resp : new SendingResultsConfig();
        this.sendingResultsConfig.formVersionId = this.formVersion.id;
      });
    }
  }

  onEnableReports() {
    this.sendingResultsConfig.enabled = true;
    this.prepareExternalApiMappingData();
    this.reportsService
      .putReportsConfig(this.formVersion, this.sendingResultsConfig)
      .subscribe((r) => this.getSendingReportsConf());
  }

  onDisableReports() {
    this.reportsService.disableConfig(this.formVersion).subscribe((r) => this.getSendingReportsConf());
  }

  onAddEmail() {
    if (!this.sendingResultsConfig.recipientEmails) {
      this.sendingResultsConfig['recipientEmails'] = [];
    }
    if (this.sendingResultsConfig?.recipientEmails && !Array.isArray(this.sendingResultsConfig?.recipientEmails)) {
      this.sendingResultsConfig.recipientEmails = [];
    }
    this.sendingResultsConfig.recipientEmails.push('');
  }

  onRemoveEmail(i) {
    if (this.sendingResultsConfig?.recipientEmails && this.sendingResultsConfig?.recipientEmails?.length) {
      this.sendingResultsConfig.recipientEmails.splice(i, 1);
    }
  }

  trackByIdx(index: number): number {
    return index;
  }

  prepareExternalApiMappingData(): void {
    this.sendingResultsConfig.registeredExternalApis?.forEach((elem) => {
      Object.entries(elem.registeredExternalApiMapping)?.forEach((item) => {
        if (item[1].backgroundDataField)
          item[1].backgroundDataField = this.recipientListSetingsComponent.getPropNameFromDisplayName(
            false,
            item[1].backgroundDataField
          );
      });
    });
  }
}
