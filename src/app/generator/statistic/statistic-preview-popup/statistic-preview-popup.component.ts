import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStringAdapter } from 'src/app/_shared/services/time-adapter.service';

@Component({
  selector: 'statistic-preview-popup',
  templateUrl: './statistic-preview-popup.component.html',
  providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }]
})
export class StatisticPreviewPopupComponent {
  view: any[] = [700, 400];

  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'lata';
  showYAxisLabel: boolean = true;
  xAxisLabel = 'Płeć';

  constructor(
    public dialogRef: MatDialogRef<StatisticPreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick() {
    this.dialogRef.close();
  }
}
