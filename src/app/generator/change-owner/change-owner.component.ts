import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, catchError, map, of, take, tap } from 'rxjs';
import { Form } from 'src/app/_shared/models/form.model';
import { AppUser } from 'src/app/_shared/models/app-user.model';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { FormOwnersService } from 'src/app/_shared/services/form-owners.service';

@Component({
  selector: 'change-owner',
  templateUrl: './change-owner.component.html',
  styleUrls: ['./change-owner.component.scss']
})
export class ChangeOwnerComponent {
  appUsers$: Observable<AppUser[]> = this.formOwnersService.getAppUsers().pipe(
    take(1),
    catchError(() => {
      this.snackBar.open('Nie udało się pobrać listy użytkowników');
      this.dialogRef.close();
      return of([]);
    }),
    map((formOwners) => formOwners.filter((user) => user.id !== this.form.redactorId))
  );
  newOwner: string;

  constructor(
    private dialogRef: MatDialogRef<ChangeOwnerComponent>,
    @Inject(MAT_DIALOG_DATA) public form: Form,
    private snackBar: SnackbarService,
    private formOwnersService: FormOwnersService
  ) {}

  changeOwner() {
    this.formOwnersService.changeOwner(this.form.id, this.newOwner).subscribe({
      next: () => {
        this.dialogRef.close(/*shouldReloadForm*/ true);
      },
      error: () => {
        this.snackBar.open(`Nie udało się zmienić właściciela formularza ${this.form.name}`);
        this.dialogRef.close();
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
