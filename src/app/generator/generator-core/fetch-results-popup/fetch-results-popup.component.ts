import { Component, Inject, OnInit } from '@angular/core';
import { FetchResultsService } from 'src/app/_shared/services/fetch-results.service';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { FormVersionFull } from 'src/app/_shared/models/form-version.model';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'fetch-results-popup',
  templateUrl: './fetch-results-popup.component.html'
})
export class FetchResultsPopupComponent implements OnInit {
  filters: FetchResultFilters = new FetchResultFilters();
  maxDate = new Date();
  datePipe = new DatePipe('en-US');

  constructor(
    public dialogRef: MatDialogRef<FetchResultsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public formVersion: FormVersionFull,
    private resultsService: FetchResultsService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.filters.dateUntil = new Date().toISOString();
  }

  onChangeWholeTimeCheckbox(e) {
    this.filters.dateFrom = '';
    this.filters.dateUntil = '';
  }

  onFetchResults() {
    const dateFrom = this.filters.dateFrom ? this.datePipe.transform(this.filters.dateFrom, 'yyy-MM-dd') : null;
    const dateUntil = this.filters.dateUntil ? this.datePipe.transform(this.filters.dateUntil, 'yyy-MM-dd') : null;

    this.resultsService.fetchResults(this.formVersion, dateFrom, dateUntil).subscribe((data: ArrayBuffer) => {
      if (data) {
        const blob = new Blob([data], { type: 'application/ms-excel' });
        const fileName = this.getResultsFileName(this.formVersion.title);
        saveAs(blob, fileName);
      } else {
        if (this.filters.dateFrom || this.filters.dateUntil) {
          this.snackbar.open('Niema wyników za ten okres');
        } else {
          this.snackbar.open('Niema wyników dla tego formularza');
        }
      }
    });
  }

  getResultsFileName(title: string) {
    if (!environment.production) {
      return `wyniki-${this.slugify(title)}.csv`;
    }

    const generateDate = this.datePipe.transform(new Date(), 'dd-MM-yyyTHH:mm');
    const fromD = this.filters.dateFrom ? `od${this.datePipe.transform(this.filters.dateFrom, 'dd-MM-yyy')}` : '';
    const toD = this.filters.dateUntil ? `do${this.datePipe.transform(this.filters.dateUntil, 'dd-MM-yyy')}` : '';
    return `wyniki-${this.slugify(title)}-${generateDate}${fromD ? fromD : ''}${toD ? toD : ''}.csv`;
  }

  onCancel() {
    this.dialogRef.close();
  }

  private slugify(str: string) {
    return str
      .toLocaleLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export class FetchResultFilters {
  dateFrom: string = null;
  dateUntil: string = null;
  forAllTime: boolean = false;
}
