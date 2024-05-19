import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { CellClickedEvent } from 'src/app/_shared/components/table/table.component';
import { TableHeader, TableHeaderType, TableOptions } from 'src/app/_shared/components/table/table.model';
import { BIG_POPUP_WIDTH } from 'src/app/_shared/consts';
import { FormVersionBase, FormVersionState, GraphValidationMessage } from 'src/app/_shared/models/form-version.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { normalizeString } from 'src/app/_shared/utils/normalize-string.utilits';
import { environment } from 'src/environments/environment';
import { DistributionListComponent } from '../distribution-list/distribution-list.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxIbeAuthService } from '@ngx-ibe/core/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'form-history',
  templateUrl: './form-history.component.html',
  styleUrls: ['./form-history.component.scss']
})
export class FormHistoryComponent implements OnInit {
  readonly noLinksAddedMessage: GraphValidationMessage = GraphValidationMessage.NO_LINKS_ADDED;
  readonly accordionTitle: string = 'Historia zmian';

  formVersionStates = FormVersionState;
  previewFormUrl: string = environment.previewFormUrl;

  formId: string;
  selectedFormVersion: FormVersionBase;
  formVersions: FormVersionBase[];

  listOptions: TableOptions = {
    showCount: false,
    pagination: false,
    clickable: true
  };

  listHeaders: TableHeader[] = [
    {
      name: 'versionMajor',
      display: 'Wersja',
      sortable: true,
      type: TableHeaderType.TEMPLATE,
      headerStyle: 'text-align: left'
    },
    {
      name: 'createDate',
      display: 'Data utworzenia',
      sortable: true,
      type: TableHeaderType.TEMPLATE,
      headerStyle: 'text-align: left'
    },
    {
      name: 'readyToPublishDate',
      display: 'Data przygotowania do publikacji',
      width: '220px',
      sortable: true,
      type: TableHeaderType.TEMPLATE,
      headerStyle: 'text-align: left'
    },
    {
      name: 'state',
      display: 'Status',
      width: '200px',
      sortable: true,
      type: TableHeaderType.TEMPLATE,
      headerStyle: 'text-align: center'
    },
    {
      name: 'redactorName',
      display: 'Modyfikował',
      sortable: true,
      type: TableHeaderType.TEMPLATE,
      headerStyle: 'text-align: left'
    },
    {
      name: '',
      display: '',
      sortable: false,
      type: TableHeaderType.TEMPLATE,
      headerStyle: 'text-align: left'
    },
    {
      name: '',
      display: '',
      sortable: false,
      type: TableHeaderType.TEMPLATE,
      headerStyle: 'text-align: left'
    }
  ];

  @Output() selectedVersionChanged = new EventEmitter<FormVersionBase>();
  @Output() latestFormVersionReloaded = new EventEmitter<FormVersionBase>();
  subscription: Subscription;
  currentUserId = '';

  user$ = this.authService.user$;

  constructor(
    private dialog: MatDialog,
    private formService: FormService,
    private activeRoute: ActivatedRoute,
    private authService: NgxIbeAuthService,
    public router: Router,
    public snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.formId = this.activeRoute.snapshot.params['id'];

    if (this.formId) {
      this.reloadFormHistory();
    }
    this.subscription = this.authService.user$.subscribe((resp) => {
      this.currentUserId = resp.sub;
    });
  }

  selectFormVersion(event: CellClickedEvent<FormVersionBase>) {
    this.selectedFormVersion = event.row;
    this.reloadFormVersion(event.row);
  }

  blockFormVersion(formVersion: FormVersionBase) {
    this.formService.changeFormVersionState(formVersion, FormVersionState.BLOCKED).subscribe(() => {
      if (formVersion.id === this.selectedFormVersion.id) {
        this.reloadFormVersion(formVersion);
      }
      this.reloadFormHistory();
    });
  }

  unblockFormVersion(formVersion: FormVersionBase) {
    this.formService.changeFormVersionState(formVersion, FormVersionState.PENDING).subscribe(() => {
      if (formVersion.id === this.selectedFormVersion.id) {
        this.reloadFormVersion(formVersion);
      }
      this.reloadFormHistory();
    });
  }

  removeFormVersion(formVersion: FormVersionBase) {
    this.formService.removeFormVersion(formVersion).subscribe(() => {
      if (this.formVersions.length === 1) {
        this.router.navigateByUrl('/');
        this.snackBar.open('Ostatnia wersja formularza została usunięta. Cały formularz został usunięty', 'OK');
        return;
      } else if (formVersion.id === this.selectedFormVersion.id) {
        this.selectedFormVersion = null;
        this.latestFormVersionReloaded.emit();
      }
      this.reloadFormHistory();
    });
  }

  exportFormVersion(formVersion: FormVersionBase) {
    this.formService.exportFormVersion(formVersion.formId, formVersion.id).subscribe((data) => {
      if (data) {
        saveAs(
          new Blob([JSON.stringify(data)], { type: 'application/json' }),
          `${normalizeString(formVersion.name)}.json`
        );
      } else {
        this.snackBar.open('Nie udało się wyeksportować konfiguracji tej wersji formularza');
      }
    });
  }

  reloadFormHistory(setLatestVersionSelected = false) {
    this.formService.getFormVersions(this.formId).subscribe((formVersions: FormVersionBase[]) => {
      this.formVersions = formVersions;
      if (!this.selectedFormVersion || setLatestVersionSelected) {
        this.selectedFormVersion = this.formVersions[0];
      }
    });
  }

  reloadFormVersion(formVersion: FormVersionBase) {
    this.selectedVersionChanged.emit(formVersion);
  }

  openDistributionList(formVersion: FormVersionBase) {
    const distributionList = this.dialog.open(DistributionListComponent, {
      width: BIG_POPUP_WIDTH,
      data: formVersion
    });
  }

  isUserForm() {
    return this.currentUserId === this.selectedFormVersion.redactorId;
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
