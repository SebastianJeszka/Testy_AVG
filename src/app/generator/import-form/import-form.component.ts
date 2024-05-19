import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormService } from 'src/app/_shared/services/form.service';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';

@Component({
  selector: 'import-form',
  templateUrl: './import-form.component.html',
  styleUrls: ['./import-form.component.scss']
})
export class ImportFormComponent {
  formTechName: string = '';

  constructor(
    private dialogRef: MatDialogRef<ImportFormComponent>,
    private formService: FormService,
    private snackBar: SnackbarService
  ) {}

  importFile(files: File[]) {
    const [selectedFile] = files;
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile);
    fileReader.onload = ({ target: { result: formConfg } }) => {
      this.formService.importFormConfig(JSON.parse(formConfg as string), this.formTechName).subscribe({
        next: () => {
          this.dialogRef.close(/*shouldReloadForm*/ true);
        },
        error: () => {
          this.dialogRef.close();
        }
      });
    };
    fileReader.onerror = () => {
      this.snackBar.open('Nie udało się zaimportować pliku');
    };
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
