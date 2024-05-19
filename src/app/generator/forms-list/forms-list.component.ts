import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Observable, Subscription, combineLatest, of, map } from 'rxjs';
import { saveAs } from 'file-saver';
import { TableHeader, TableHeaderType, TableOptions } from 'src/app/_shared/components/table/table.model';
import { Form, FormStateLabels, FormCategory, FormState } from 'src/app/_shared/models/form.model';
import { List } from 'src/app/_shared/models/list.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { Router } from '@angular/router';
import { CellClickedEvent } from 'src/app/_shared/components/table/table.component';
import { normalizeString } from 'src/app/_shared/utils/normalize-string.utilits';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { ImportFormComponent } from '../import-form/import-form.component';
import { CloneFormComponent } from '../clone-form/clone-form.component';
import { FormVersionTypeLabels, FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ChangeOwnerComponent } from '../change-owner/change-owner.component';
import { NgxIbeAuthService } from '@ngx-ibe/core/auth';
import { NgxIbeRolesService } from '@ngx-ibe/core/roles';

class ActiveFilters {
  redactorIds: string[] = [];
  formStates: FormState[] = [];
  formTypes: FormVersionTypes[] = [];
  textFilter: string = '';
}

class FilterOptions {
  formTypeOptions: OptionItem[] = [];
  redactorNameOptions: OptionItem[] = [];
  formStateOptions: OptionItem[] = [];
}
@Component({
  selector: 'forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  formStateLabels = FormStateLabels;

  isLoadingResults: boolean = false;

  formTypeLabels = FormVersionTypeLabels;

  listOptions: TableOptions = {
    showCount: true,
    filter: true,
    filterLabel: 'Znajdź formularz po tytule',
    filterPlaceholder: 'Wpisz tytuł formularza którego szukasz',
    defaultColumnSorting: 'createDate'
  };

  listHeaders: TableHeader[] = this.getListHeaderConfig();

  private allActiveForms$: Observable<Form[]>;
  filteredActiveForms$: Observable<Form[]>;
  archivedForms$: Observable<Form[]>;

  filterOptions: FilterOptions = new FilterOptions();
  activeFilters: ActiveFilters = new ActiveFilters();

  childrenFormList: Form[] = [];
  activeChildRow = '';

  onlyMyOwnPrivilege: Observable<boolean> = this.rolesService.hasRole('ONLY_MY_OWN');
  allowChangeOwnerPrivilege: Observable<boolean> = this.rolesService.hasRole('ALLOW_CHANGE_OWNER');
  isShowOnlyMyOwn: boolean = false;
  subscription: Subscription;
  currentUserId = '';

  constructor(
    private formService: FormService,
    private router: Router,
    private snackBar: SnackbarService,
    private authService: NgxIbeAuthService,
    public dialog: MatDialog,
    private rolesService: NgxIbeRolesService
  ) {}

  ngOnInit() {
    this.subscription = combineLatest([this.onlyMyOwnPrivilege, this.authService.user$]).subscribe(([resp, user]) => {
      this.isShowOnlyMyOwn = resp;
      this.currentUserId = user.sub;
    });
    this.reloadForms();
  }

  reloadForms() {
    this.isLoadingResults = true;
    this.formService
      .getFormsList()
      .subscribe((formList: List<Form>) => {
        const forms = formList.items;

        this.allActiveForms$ = this.isShowOnlyMyOwn
          ? of(
              forms.filter(
                (form) =>
                  (form.redactorId === this.currentUserId && form.visibleInTab === FormCategory.ACTIVE) ||
                  !form.visibleInTab
              )
            )
          : of(forms.filter((form) => form.visibleInTab === FormCategory.ACTIVE || !form.visibleInTab));

        this.filteredActiveForms$ = this.allActiveForms$;
        this.archivedForms$ = of(forms.filter((form) => form.visibleInTab === FormCategory.ARCHIVED));

        this.setFilterOptionsDynamically(forms);
      })
      .add(() => {
        this.isLoadingResults = false;
      });
  }

  getTemplateChildren(id: string): void {
    if (this.activeChildRow === id) {
      this.activeChildRow = '';
      this.childrenFormList = [];
    } else {
      this.isLoadingResults = true;
      this.formService
        .getTemplateChildList(id)
        .subscribe((formList: List<Form>) => {
          this.childrenFormList = formList.items;
          this.activeChildRow = id;
        })
        .add(() => {
          this.isLoadingResults = false;
        });
    }
  }

  private setFilterOptionsDynamically(forms: Form[]) {
    forms.forEach((form) => {
      this.setRedactorNameOptions(form);
      this.setFormTypeOptions(form);
      this.setFormStateOptions(form);
    });
  }

  private setFormTypeOptions(form: Form) {
    const formTypeOptionsIds = this.filterOptions.formTypeOptions.map((formTypeOption) => formTypeOption.id);
    if (!formTypeOptionsIds.includes(form.type)) {
      const newOption = {
        id: form.type,
        name: FormVersionTypeLabels[form.type]
      } as OptionItem;

      this.filterOptions.formTypeOptions = this.filterOptions.formTypeOptions.concat(newOption);
    }
  }

  private setRedactorNameOptions(form: Form) {
    const redactorIds = this.filterOptions.redactorNameOptions.map((redactorNameOption) => redactorNameOption.id);
    if (this.isShowOnlyMyOwn && this.currentUserId === form.redactorId) {
      const newOption = {
        id: form.redactorId,
        name: form.redactorName
      } as OptionItem;
      this.filterOptions.redactorNameOptions = [newOption];
    } else if (!redactorIds.includes(form.redactorId)) {
      const newOption = {
        id: form.redactorId,
        name: form.redactorName
      } as OptionItem;
      this.filterOptions.redactorNameOptions = this.filterOptions.redactorNameOptions.concat(newOption);
    }
  }

  private setFormStateOptions(form: Form) {
    const formStateOptionsIds = this.filterOptions.formStateOptions.map((formStateOption) => formStateOption.id);
    if (!formStateOptionsIds.includes(form.state)) {
      const newOption = {
        id: form.state,
        name: FormStateLabels[form.state]
      } as OptionItem;

      this.filterOptions.formStateOptions = this.filterOptions.formStateOptions.concat(newOption);
    }
  }

  onAppTableFilterChanged(textFilter: string) {
    this.activeFilters.textFilter = textFilter;
    this.onCustomSelectFiltersChanged();
  }

  onCustomSelectFiltersChanged() {
    const { redactorIds, formStates, formTypes, textFilter } = this.activeFilters;
    const isAnyActiveFilterApplied = redactorIds.length || formStates.length || formTypes.length || textFilter;

    this.filteredActiveForms$ = isAnyActiveFilterApplied
      ? this.allActiveForms$.pipe(
          map((forms) =>
            forms
              .filter(({ redactorId }) => (redactorIds.length ? redactorIds.includes(redactorId) : true))
              .filter(({ state }) => (formStates.length ? formStates.includes(state) : true))
              .filter(({ type }) => (formTypes.length ? formTypes.includes(type) : true))
              .filter(({ name }) => (textFilter ? name.toLowerCase().includes(textFilter.toLowerCase()) : true))
          )
        )
      : this.allActiveForms$;
  }

  onClickRecord(event: CellClickedEvent<Form>) {
    this.router.navigateByUrl(`generator/view/${event.row.id}`);
  }

  changeOwner(form: Form) {
    const dialogRef = this.dialog.open(ChangeOwnerComponent, { data: form });

    dialogRef.afterClosed().subscribe((shouldReloadForms) => {
      if (shouldReloadForms) {
        this.reloadForms();
      }
    });
  }

  exportForm(form: Form) {
    this.formService.exportFormVersion(form.id).subscribe((data) => {
      if (data) {
        saveAs(new Blob([JSON.stringify(data)], { type: 'application/json' }), `${normalizeString(form.name)}.json`);
      } else {
        this.snackBar.open('Nie udało się wyeksportować konfiguracji formularza');
      }
    });
  }

  removeForm(form: Form) {
    this.formService.removeForm(form.id).subscribe(() => {
      this.reloadForms();
      this.snackBar.open('Formularz został usunięty!');
    });
  }

  cloneForm(form: Form) {
    const dialogRef = this.dialog.open(CloneFormComponent, { data: form.id });

    dialogRef.afterClosed().subscribe((shouldReloadForms) => {
      if (shouldReloadForms) {
        this.reloadForms();
      }
    });
  }

  archiveForm(form: Form) {
    this.formService.changeTab(form.id, FormCategory.ARCHIVED).subscribe(() => {
      this.reloadForms();
    });
  }

  importForm() {
    const dialogRef = this.dialog.open(ImportFormComponent);

    dialogRef.afterClosed().subscribe((shouldReloadForms) => {
      if (shouldReloadForms) {
        this.reloadForms();
      }
    });
  }

  getListHeaderConfig(): TableHeader[] {
    return [
      {
        //childrenrow
        name: '',
        display: '',
        sortable: false,
        filterable: true,
        width: '15px',
        minWidth: '15px',
        maxWidth: '15px',
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'name',
        display: 'Tytuł',
        sortable: true,
        filterable: true,
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'redactorName',
        display: 'Właściciel',
        sortable: true,
        filterable: true,
        width: '170px',
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'state',
        display: 'Status',
        sortable: true,
        filterable: true,
        width: '160px',
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'type',
        display: 'Typ',
        sortable: true,
        filterable: true,
        width: '130px',
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      },
      {
        name: 'createDate',
        display: 'Data utworzenia',
        sortable: true,
        width: '200px',
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left',
        hideColumn: this.rolesService.exceptRole('DICTIONARY_ANY_EDIT')
      },
      {
        name: '',
        display: '',
        sortable: false,
        width: '40px',
        type: TableHeaderType.TEMPLATE,
        headerStyle: 'text-align: left'
      }
    ];
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
