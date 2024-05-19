import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormService } from 'src/app/_shared/services/form.service';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';

@Component({
  selector: 'clone-form',
  templateUrl: './clone-form.component.html',
  styleUrls: ['./clone-form.component.scss']
})
export class CloneFormComponent {
  formTechName: string = '';

  constructor(
    private dialogRef: MatDialogRef<CloneFormComponent>,
    @Inject(MAT_DIALOG_DATA) private formId: string,
    private formService: FormService,
    private snackBar: SnackbarService
  ) {}

  cloneForm() {
    this.formService.cloneForm(this.formId, this.formTechName).subscribe({
      next: () => {
        this.dialogRef.close(/*shouldReloadForm*/ true);
      },
      error: () => {
        this.snackBar.open('Nie udało się sklonować formularza');
        this.dialogRef.close();
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
