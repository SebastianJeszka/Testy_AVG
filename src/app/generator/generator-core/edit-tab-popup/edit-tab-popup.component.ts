import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationStep } from 'src/app/_shared/models/stepper.model';
import { EditTabForm, Tab } from 'src/app/_shared/models/tab.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';

@Component({
  selector: 'edit-tab-popup',
  templateUrl: './edit-tab-popup.component.html'
})
export class EditTabPopupComponent implements OnInit {
  form: EditTabForm;

  constructor(
    public dialogRef: MatDialogRef<EditTabPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tab: Tab;
      steps: NavigationStep[];
      enableNavigation: boolean;
    },
    private formService: FormService,
    public snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.form = {
      name: this.data.tab.title,
      navigationStepId: this.data.tab.navigationStepId,
      showInSummary: this.data.tab.showInSummary
    };
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.form.name !== this.data.tab.title && this.formService.checkIfTabNameExist(this.form.name)) {
      this.snackBar.open('Taka nazwa już istnieje', 'OK');
      return;
    }
    this.dialogRef.close(this.form);
  }
}
