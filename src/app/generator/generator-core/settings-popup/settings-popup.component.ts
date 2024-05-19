import { Component, Inject } from '@angular/core';
import { NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { NgxIbeRolesService } from '@ngx-ibe/core/roles';
import { FormVersionFull, FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { NgbTimeStringAdapter } from 'src/app/_shared/services/time-adapter.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

enum SettingsPopupTab {
  GENERAL,
  SENDING_RESULTS,
  ACCESS_FORM
}

@Component({
  selector: 'settings-popup',
  templateUrl: './settings-popup.component.html',
  providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }]
})
export class SettingsPopupComponent {
  initialCurrentTabName: SettingsPopupTab = SettingsPopupTab.GENERAL;
  settingsPopupTabEnum = SettingsPopupTab;
  formVersionTypeEnum = FormVersionTypes;

  currentTab: MatTabChangeEvent;

  sendResultsTabDisabled: Observable<boolean> = this.rolesService.exceptRole('ALLOW_DATA_READ');
  accessFormSettingsTabDisabled: Observable<boolean> = this.rolesService.exceptRole('ALLOW_PROCESSES_MANAGE');

  constructor(
    public dialogRef: MatDialogRef<SettingsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public formVersion: FormVersionFull,
    private rolesService: NgxIbeRolesService
  ) {}

  onNoClick() {
    this.dialogRef.close();
  }

  tabChange($event: MatTabChangeEvent) {
    this.currentTab = $event;
  }
}
