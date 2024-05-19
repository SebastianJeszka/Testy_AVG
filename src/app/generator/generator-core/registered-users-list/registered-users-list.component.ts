import { Component, Input, OnChanges } from '@angular/core';
import { TableHeader, TableHeaderType, TableOptions } from 'src/app/_shared/components/table/table.model';
import { RegistrationFormUser, RegistrationFormUserState } from 'src/app/_shared/models/access-user.model';
import { AccessUserService } from 'src/app/_shared/services/access-user.service';
import { FormService } from 'src/app/_shared/services/form.service';

@Component({
  selector: 'registered-users-list',
  templateUrl: './registered-users-list.component.html',
  styleUrls: ['./registered-users-list.component.scss']
})
export class RegisteredUsersListComponent implements OnChanges {
  @Input() formId: string;

  approvedList: RegistrationFormUser[] = [];
  waitingList: RegistrationFormUser[] = [];
  rejectedList: RegistrationFormUser[] = [];
  registrationFormUserState = RegistrationFormUserState;

  listOptions: TableOptions = this.getListOptions();
  listHeaders: TableHeader[] = this.getListHeadersOptions();

  constructor(private accessUserService: AccessUserService, private formService: FormService) {}

  ngOnChanges() {
    this.refreshList();
  }

  setRegistrationUserState(userId: string, state: RegistrationFormUserState) {
    this.accessUserService.setRegistrationUserState(userId, state).subscribe({
      complete: () => this.refreshList()
    });
  }

  private refreshList() {
    if (this.formId) {
      this.accessUserService
        .getRegistrationFormsUser(this.formService.currentFormVersion.formId, this.formId)
        .subscribe({
          next: (response) => {
            this.approvedList = response.items.filter((item) => item.state === RegistrationFormUserState.APPROVED);
            this.waitingList = response.items.filter(
              (item) => item.state === RegistrationFormUserState.WAITING_FOR_APPROVAL
            );
            this.rejectedList = response.items.filter((item) => item.state === RegistrationFormUserState.REJECTED);
          }
        });
    }
  }

  private getListOptions(): TableOptions {
    return {
      showCount: false,
      filter: false,
      pagination: false
    };
  }

  private getListHeadersOptions(): TableHeader[] {
    return [
      {
        name: 'name',
        display: 'Imię',
        sortable: true,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'surname',
        display: 'Nazwisko',
        sortable: true,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'email',
        display: 'Adres e-mail',
        sortable: true,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: '',
        display: 'Akcja',
        sortable: false,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: right; padding-right: 1rem;'
      }
    ];
  }
}
