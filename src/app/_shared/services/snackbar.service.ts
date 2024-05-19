import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snack: MatSnackBar) {}

  open(message, action = 'Rozumiem', duration = 5000, pos = 'top') {
    const snackbar = this.snack.open(message, action ? action : 'X', {
      duration,
      verticalPosition: pos as MatSnackBarVerticalPosition,
      panelClass: ['mat-snack']
    });

    snackbar
      .afterOpened()
      .pipe(first())
      .subscribe(() => {
        const snackbarComponent = document.querySelector('snack-bar-container');
        if (snackbarComponent) {
          const container = this.getParentNode(snackbarComponent.parentElement, 'cdk-overlay-container');
          container.classList.add('custom-snack-bar-container');
        }
      });
  }

  private getParentNode(element: HTMLElement, className: string): HTMLElement {
    if (!element) {
      return;
    }

    if (element.classList.contains(className)) {
      return element;
    }

    return this.getParentNode(element.parentElement, className);
  }
}
