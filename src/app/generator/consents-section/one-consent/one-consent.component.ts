import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CKEditor4 } from 'ckeditor4-angular';
import { ckeditorConfig } from 'src/app/_shared/models/ckeditor-config.model';
import { Consent } from 'src/app/_shared/models/question-field.model';

@Component({
  selector: 'one-consent',
  templateUrl: './one-consent.component.html'
})
export class OneConsentComponent implements OnInit {
  ckeditorConf: CKEditor4.Config = null;

  description: string;

  constructor(
    public dialogRef: MatDialogRef<OneConsentComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Consent
  ) {}

  ngOnInit(): void {
    this.ckeditorConf = ckeditorConfig();
    this.ckeditorConf.height = 180;
    this.description = this.data?.description || '';
  }

  onSave() {
    this.dialogRef.close(this.description);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
