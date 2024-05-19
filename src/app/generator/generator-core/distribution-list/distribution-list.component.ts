import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormSettings } from 'src/app/_shared/models/form-settings.model';
import { FormVersionBase, FormVersionState } from 'src/app/_shared/models/form-version.model';
import { FormSettingsService } from 'src/app/_shared/services/form-settings.service';

@Component({
  selector: 'app-distribution-list',
  templateUrl: './distribution-list.component.html',
  styleUrls: ['./distribution-list.component.scss']
})
export class DistributionListComponent implements OnInit {
  @ViewChild('dialogContent') content: ElementRef<HTMLDivElement>;

  disableState: boolean = false;
  emailsList: string[] = [];

  private currentSettings: FormSettings;

  constructor(
    private dialogRef: MatDialogRef<DistributionListComponent>,
    @Inject(MAT_DIALOG_DATA) private formVersion: FormVersionBase,
    private formSettings: FormSettingsService
  ) {}

  ngOnInit(): void {
    this.disableState = !(
      this.formVersion.state === FormVersionState.SKETCH || this.formVersion.state === FormVersionState.PENDING
    );

    this.formSettings.getSettings(this.formVersion).subscribe((settings) => {
      this.currentSettings = settings;

      if (!!settings.ticketMailingList) {
        this.emailsList = settings.ticketMailingList;
      }
    });
  }

  onAddEmail() {
    this.emailsList.push('');

    if (this.content) {
      setTimeout(() => {
        this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
      });
    }
  }

  onRemoveEmail(i) {
    this.emailsList.splice(i, 1);
  }

  onSave() {
    this.currentSettings.ticketMailingList = this.emailsList;
    this.formSettings.setSettings(this.currentSettings, this.formVersion).subscribe(() => {
      this.dialogRef.close();
    });
  }

  trackByIdx(index: number): number {
    return index;
  }
}
