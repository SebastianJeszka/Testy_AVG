import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { ckeditorConfig } from 'src/app/_shared/models/ckeditor-config.model';
import { Form } from 'src/app/_shared/models/form.model';
import { List } from 'src/app/_shared/models/list.model';
import { AppProcess } from 'src/app/_shared/models/process-of-node.model';
import { AccessUserService } from 'src/app/_shared/services/access-user.service';

@Component({
  selector: 'user-verification-process',
  templateUrl: './user-verification-process.component.html',
  styleUrls: ['./user-verification-process.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class UserVerificationProcessComponent implements OnInit {
  @Input() process: AppProcess = null;
  @Input() processExecuteTime: 'before' | 'after' = null;
  @Input() disableState: boolean = false;

  ckeditor: CKEditor4.Config = ckeditorConfig();
  registerFormList: List<Form> = new List(0, []);
  registerFormSettings = {
    formId: null,
    verificationErrorMessage: ''
  };

  constructor(private accessUserService: AccessUserService) {}

  ngOnInit(): void {
    this.accessUserService.getRegistrationFormsList().subscribe((registerForms) => {
      this.registerFormList = registerForms;
      this.registerFormList.items
        .sort((a, b) => {
          const aDate = new Date(a.createDate);
          const bDate = new Date(b.createDate);
          return bDate.getTime() - aDate.getTime();
        })
        .forEach((a) => (a.disabled = a.occupied && a.id != this.process.registerFormId));
    });
  }
}
