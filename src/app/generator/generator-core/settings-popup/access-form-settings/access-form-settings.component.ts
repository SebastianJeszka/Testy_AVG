import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { CKEditor4 } from 'ckeditor4-angular';
import { Subscription } from 'rxjs';
import { ckeditorConfig } from 'src/app/_shared/models/ckeditor-config.model';
import { FormSettings } from 'src/app/_shared/models/form-settings.model';
import { FormVersionFull } from 'src/app/_shared/models/form-version.model';
import { Form } from 'src/app/_shared/models/form.model';
import { List } from 'src/app/_shared/models/list.model';
import { AppProcess, ProcessType } from 'src/app/_shared/models/process-of-node.model';
import { AccessUserService } from 'src/app/_shared/services/access-user.service';
import { FormSettingsService } from 'src/app/_shared/services/form-settings.service';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';

@Component({
  selector: 'access-form-settings',
  templateUrl: './access-form-settings.component.html'
})
export class AccessFormSettingsComponent implements OnChanges {
  @Input() formVersion: FormVersionFull;

  formSettings: FormSettings = new FormSettings();
  userVerificationProcess: AppProcess;

  constructor(private formSettingsService: FormSettingsService, private snackBar: SnackbarService) {}

  ngOnChanges(): void {
    if (this.formVersion) {
      this.userVerificationProcess = this.getRegistrationProcess();

      // this.userVerificationProcess.registerFormId = "9ccf724c-efee-4018-8b0e-8667b311cc63";

      this.formSettingsService
        .getSettings(this.formVersion)
        .subscribe((formSettings) => (this.formSettings = formSettings));
    }
  }

  onSave() {
    this.formSettings.formVersionId = this.formVersion.id;

    this.formSettingsService.setSettings(this.formSettings, this.formVersion).subscribe(() => {
      this.snackBar.open('Zmiany zostały zastosowane', 'OK');
      this.formSettingsService.settingsChanged.next(this.formSettings);
    });
  }

  private getRegistrationProcess() {
    if (!this.formVersion) return;

    const node = this.formVersion.flow.nodes.find(
      (node) =>
        node.data?.processes.afterProcess.type === ProcessType.USER_VERIFICATION ||
        node.data?.processes.beforeProcess.type === ProcessType.USER_VERIFICATION
    );

    if (!node) return;

    if (node.data?.processes.afterProcess.type === ProcessType.USER_VERIFICATION) {
      return node.data.processes.afterProcess;
    } else if (node.data?.processes.beforeProcess.type === ProcessType.USER_VERIFICATION) {
      return node.data.processes.beforeProcess;
    }

    return;
  }
}
