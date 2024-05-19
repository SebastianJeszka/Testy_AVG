import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormService } from '../../_shared/services/form.service';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { ApiSourceConfig } from '../../_shared/models/question-field.model';

@Component({
  selector: 'app-import-api-sources',
  templateUrl: './import-api-sources.component.html',
  styleUrls: ['./import-api-sources.component.scss']
})
export class ImportApiSourcesComponent implements OnInit {
  isNameExtended: boolean = false;
  apiRequestError: boolean = false;
  apiResponseData: any;
  options: OptionItem[] = [];
  apiSourceConfig: ApiSourceConfig = null;

  dynamicFieldVariable = '';
  isDynamicFieldVariable: boolean = false;

  constructor(
    private formService: FormService,
    private dialogRef: MatDialogRef<ImportApiSourcesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.config?.apiSourceUrl) {
      this.apiSourceConfig = new ApiSourceConfig(
        this.data.config.apiSourceUrl,
        this.data.config.answerProperty,
        this.data.config.jsonAtaQuery,
        this.data.config.dynamicFieldVariable
      );
      this.getInterpolationMatches(this.data.config.apiSourceUrl);
    } else {
      this.apiSourceConfig = new ApiSourceConfig();
    }
    if (this.apiSourceConfig?.dynamicFieldVariable) {
      this.isDynamicFieldVariable = true;
      this.dynamicFieldVariable = this.apiSourceConfig.dynamicFieldVariable;
    }
  }

  getInterpolationMatches(value: string) {
    if (value?.match(/\{{[^\{^\}]+\}}/g)) {
      this.dynamicFieldVariable = value?.match(/\{{[^\{^\}]+\}}/g)[0].replace(/[\{\}]/g, '');
    } else {
      this.dynamicFieldVariable = null;
      this.isDynamicFieldVariable = false;
    }
  }

  onDynamicVariableChange() {
    this.isDynamicFieldVariable
      ? (this.apiSourceConfig.dynamicFieldVariable = this.dynamicFieldVariable)
      : (this.apiSourceConfig.dynamicFieldVariable = null);
  }

  getApiSourceData(): void {
    this.apiRequestError = false;
    this.formService.externalApiRequest(this.apiSourceConfig.apiSourceUrl).subscribe(
      (resp: any) => {
        this.onDataLoaded(resp);
      },
      (error) => {
        JSON.stringify(error) ? ((this.apiResponseData = JSON.stringify(error)), null, 2) : null;
        this.apiRequestError = true;
        this.apiResponseData = '';
        setTimeout(() => {
          this.apiRequestError = false;
        }, 6000);
      }
    );
  }

  onDataLoaded(data): void {
    if (JSON.stringify(data)) {
      this.apiResponseData = JSON.stringify(data, null, 2);
    }
  }

  onChoseApiSourceData() {
    this.dialogRef.close(this.apiSourceConfig);
  }
}
