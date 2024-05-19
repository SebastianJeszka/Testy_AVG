import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { ckeditorConfig } from 'src/app/_shared/models/ckeditor-config.model';
import { AppProcess } from 'src/app/_shared/models/process-of-node.model';

@Component({
  selector: 'ticket-process',
  templateUrl: './ticket-process.component.html',
  styleUrls: ['./ticket-process.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class TicketProcessComponent {
  @Input() process: AppProcess = null;
  @Input() processExecuteTime: 'before' | 'after' = null;
  @Input() disableState: boolean = false;

  ckeditor: CKEditor4.Config = ckeditorConfig();

  constructor() {}
}
