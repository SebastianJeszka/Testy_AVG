import { Component, OnInit, ViewChildren, QueryList, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { QuestionField, MoveQuestion } from '../../_shared/models/question-field.model';
import { FormService } from '../../_shared/services/form.service';
import { GridsterItem, GridsterConfig } from 'angular-gridster2';
import {
  FormVersionFull,
  FormVersionBase,
  FormVersionState,
  FormVersionTypes,
  GraphValidationMessage,
  FormVersionTypeLabels,
  RegistrationConfirmationType,
  RegistrationConfirmationTypeLabels
} from '../../_shared/models/form-version.model';
import { GridOfFieldsComponent } from '../grid-of-fields/grid-of-fields.component';
import { SettingsPopupComponent } from './settings-popup/settings-popup.component';
import { BIG_POPUP_HEIGHT, BIG_POPUP_WIDTH } from 'src/app/_shared/consts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppGridsterItem, DefaultTabLabels, Tab, TabType } from 'src/app/_shared/models/tab.model';
import { countColsForRepeatingSection, countRowsForInput } from '../../_shared/utils/generator-utilits';
import { Observable, Subscription, combineLatest, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TabsController } from './tabs.controller';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { TabsFlowGraphController } from '../tabs-flow-editor/tabs-flow-graph.controller';
import { FetchResultsPopupComponent } from './fetch-results-popup/fetch-results-popup.component';
import { AddFieldFormComponent } from '../add-field-form/add-field-form.component';
import { RepeatedSectionPopupComponent } from './repeated-section-popup/repeated-section.component';
import { FormSettingsService } from 'src/app/_shared/services/form-settings.service';
import { FormSettings } from 'src/app/_shared/models/form-settings.model';
import { AppRuleSet, LinkEdge } from 'src/app/_shared/models/link-edge.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { ProcessConfigService } from 'src/app/_shared/services/process-config.service';
import { Rule } from 'src/app/external-modules/query-builder/query-builder.interfaces';
import { FormHistoryComponent } from './form-history/form-history.component';
import { ProcessType } from 'src/app/_shared/models/process-of-node.model';
import { getTemporaryId } from 'src/app/_shared/utils/unique-id.utilits';
import { normalizeString } from 'src/app/_shared/utils/normalize-string.utilits';
import { NgxIbeRolesService } from '@ngx-ibe/core/roles';
import { MatDialog } from '@angular/material/dialog';
import { AddConfigFieldFormComponent } from '../add-config-field-form/add-config-field-form.component';
import { MatSelect } from '@angular/material/select';
import { ServiceConfigService } from 'src/app/_shared/services/service-config.service';
import { ServiceConfig, ServiceConfigStep, ServiceConfigVersion } from 'src/app/_shared/models/service-config.model';
import { ServiceCharter } from 'src/app/_shared/models/service-charter.model';
import { NgxIbeAuthService } from '@ngx-ibe/core/auth';

@Component({
  selector: 'form-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit, OnDestroy {
  @ViewChildren(GridOfFieldsComponent) grids: QueryList<GridOfFieldsComponent>;

  @ViewChild(FormHistoryComponent)
  private formHistoryComponent!: FormHistoryComponent;

  gridConfigs: GridsterConfig[] = [];
  formVersion: FormVersionFull;

  defaultCoulmnsNumber = 3;
  updateChangesDelay = 150;
  changesTimeout = null;
  background: SafeResourceUrl = null;

  formVersionState = FormVersionState;

  isEditState = false;
  isLoading = false;
  isDragging: boolean = false;
  isResizing: boolean = false;
  isEdited = false;

  // tabs
  activeTabIndex = 0;
  formVersionTypes = FormVersionTypes;
  formVersionTypeLabels = FormVersionTypeLabels;
  registrationConfirmationType = RegistrationConfirmationType;
  registrationConfirmationTypeLabels = RegistrationConfirmationTypeLabels;
  newTabName: string = '';
  tabsNames: string[] = [];
  tabWithActiveSettings: Tab = null;
  currentTabIdParam: string = '';

  previewFormUrl: string = environment.previewFormUrl;

  // ctrls
  tabsController = new TabsController(this);
  graphController: TabsFlowGraphController = new TabsFlowGraphController(this);

  isSettingsLoading: boolean = false;
  formSettings: FormSettings;
  settingsSub: Subscription;

  formId: string = '';
  graphValidationMessage: GraphValidationMessage = null;

  linksAdded: boolean = false;

  saveButtonFixed: boolean = false;
  @HostListener('window:scroll', ['$event']) onscroll() {
    const tabLabelContainer = document.querySelector('.mat-tab-label-container');
    const footerContainer = document.querySelector('footer');
    const footerHeight = footerContainer.offsetHeight;
    const footerPosition = footerContainer.getBoundingClientRect().top - 346 - footerHeight;
    if (
      tabLabelContainer &&
      tabLabelContainer.getBoundingClientRect().top < 76 &&
      footerPosition &&
      footerPosition > 0
    ) {
      this.saveButtonFixed = true;
    } else {
      this.saveButtonFixed = false;
    }
  }

  formTypeFormDisabled$: Observable<boolean> = this.rolesService.exceptRole('ALLOW_FORM_QUESTIONNAIRE');
  formTypeQuizDisabled$: Observable<boolean> = this.rolesService.exceptRole('ALLOW_FORM_QUIZ');
  formTypeRegistrationDisabled$: Observable<boolean> = this.rolesService.exceptRole('ALLOW_FORM_ACCESS_REG');
  formTypeTemplateDisabled$: Observable<boolean> = this.rolesService.exceptRole('ALLOW_FORM_TEMPLATE');
  formTypeServiceDisabled$: Observable<boolean> = this.rolesService.exceptRole('ALLOW_FORM_SERVICE');
  formConfigChangeDisabled$: Observable<boolean> = this.rolesService.exceptRole('ALLOW_SERVICE_CONFIG_CHANGE');

  subscription: Subscription;
  currentUserId = '';

  constructor(
    public formService: FormService,
    public dialog: MatDialog,
    private sanitize: DomSanitizer,
    private activeRoute: ActivatedRoute,
    public router: Router,
    public snackBar: SnackbarService,
    private formSettingsService: FormSettingsService,
    private authService: NgxIbeAuthService,
    private processConfig: ProcessConfigService,
    private rolesService: NgxIbeRolesService,
    private serviceConfigService: ServiceConfigService
  ) {}

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.isEdited;
  }

  ngOnInit() {
    this.formId = this.activeRoute.snapshot.params['id'];
    this.currentTabIdParam = this.activeRoute.snapshot.queryParams['currentTabId'];
    this.reloadLatestFormVersion();
    this.subscription = this.authService.user$.subscribe((resp) => {
      this.currentUserId = resp.sub;
    });
  }

  reloadLatestFormVersion() {
    if (this.formId) {
      this.isLoading = true;
      this.formService
        .getLatestFormVersion(this.formId)
        .subscribe((formVersion) => {
          this.isEditState = true;
          this.initGrid(formVersion);
          this.getSettings();
        })
        .add(() => {
          this.setGraphValidationMessage();
          this.linksAdded = !this.graphController.checkIfNoLinksAdded();
          this.isLoading = false;
        });
    } else {
      this.isEditState = false;
      const questFromStorage = this.formService.getFieldsFromStorage();
      this.initGrid(questFromStorage);
    }

    this.settingsListener();
  }

  selectFormVersion(formVersion: FormVersionBase) {
    if (this.formId) {
      this.isLoading = true;
      this.formService
        .getFormVersion(formVersion.formId, formVersion.id)
        .subscribe((formVersion) => {
          this.isEditState = true;
          this.initGrid(formVersion);
          this.getSettings();
        })
        .add(() => {
          this.setGraphValidationMessage();
          this.linksAdded = !this.graphController.checkIfNoLinksAdded();
          this.isLoading = false;
        });
    } else {
      this.isEditState = false;
      const questFromStorage = this.formService.getFieldsFromStorage();
      this.initGrid(questFromStorage);
    }

    this.settingsListener();
  }

  getSettings() {
    if (this.isSettingsLoading) return;
    this.isSettingsLoading = true;
    this.formSettingsService
      .getSettings(this.formVersion)
      .subscribe((settings: FormSettings) => {
        this.formSettings = settings;
        this.setBackground();
      })
      .add(() => (this.isSettingsLoading = false));
  }

  settingsListener() {
    this.settingsSub = this.formSettingsService.settingsChanged.subscribe((data: FormSettings) => {
      if (data) {
        this.formSettings = data;
        if (data.backgroundImage) {
          this.setBackground();
        } else {
          this.background = null;
        }
      }
    });
  }

  initGrid(formVersion: FormVersionFull) {
    this.formVersion = formVersion
      ? formVersion
      : new FormVersionFull(
          formVersion?.tabs?.length
            ? formVersion.tabs
            : [
                new Tab(
                  DefaultTabLabels[TabType.MAIN],
                  TabType.MAIN,
                  getTemporaryId(this.formService.currentFormVersion),
                  [],
                  null,
                  0
                ),
                new Tab(
                  DefaultTabLabels[TabType.FINISH],
                  TabType.FINISH,
                  getTemporaryId(this.formService.currentFormVersion),
                  [],
                  null,
                  1
                )
              ]
        );
    this.tabsNames = this.formVersion.tabs?.map((q) => q.title);
    this.formService.currentFormVersion = this.formVersion;

    if (this.formVersion.serviceId) {
      this.loadServiceConfigs();
      this.loadServiceConfigVersions(this.formVersion.serviceId);
    }

    this.initActiveTabIndex();
  }

  initActiveTabIndex() {
    if (this.currentTabIdParam && this.formVersion.tabs) {
      this.activeTabIndex = this.formVersion.tabs?.findIndex((t: Tab) => t.id === this.currentTabIdParam);
    }
  }

  setBackground() {
    if (this.formSettings && this.formSettings.backgroundImage) {
      this.background = this.sanitize.bypassSecurityTrustStyle(
        `url(${environment.gatewayUrl + '/files/' + this.formSettings.backgroundImage}) no-repeat 0 0 / cover`
      );
    } else {
      this.background = null;
    }
  }

  onTabIndexChanged(activeIndex) {
    this.activeTabIndex = activeIndex;
    this.currentTabIdParam = this.formVersion.tabs[activeIndex]?.id;
    this.router.navigate([], {
      queryParams: {
        currentTabId: this.currentTabIdParam
      },
      queryParamsHandling: 'merge'
    });
  }

  onInputChanged() {
    this.updateIsEditedFlag();
  }

  onTabNameChange(val: string, activeTabIndex: Tab) {
    this.updateIsEditedFlag();
    if (this.formService.checkIfTabNameExist(val, activeTabIndex.orderIndex)) {
      this.snackBar.open('Taka nazwa już istnieje', 'OK');
      return;
    }
  }

  onMoveItem(move: MoveQuestion) {
    if (this.checkIfFieldUsedOnGraph(move.question.field)) {
      this.snackBar.open('Nie można przenieść pola, bo jest użyty na warunkach przejść przeplywu stron', 'OK');
      return;
    }
    if (this.processConfig.getInfoOfConnectionToAutoComplete(move.question.field)) {
      this.snackBar.open(
        `Nie można przenieść pola, bo jest użyte do autouzupełnienia w ${this.processConfig.getInfoOfConnectionToAutoComplete(
          move.question.field
        )}`,
        'OK'
      );
      return;
    }
    const oldActiveTab = this.activeTabIndex;

    if (move.question.field.type === FieldTypes.REPEATING_SECTION) {
      this.addRepeatedSection(move.question.field, move.toTab);
    } else {
      this.addField(move.question.field, move.toTab);
    }

    this.removeField(move.question.field.id, oldActiveTab);
  }

  checkIfFieldUsedOnGraph(field: QuestionField) {
    if (!this.formVersion || !this.formVersion.flow) return false;
    const rulesWithField = this.formVersion.flow?.links
      .filter((link: LinkEdge) => link.data?.query?.queryRulesSet)
      .filter((link: LinkEdge) => this.checkIfRulesetHaveField(link.data.query.queryRulesSet, field.id));
    return rulesWithField.length > 0;
  }

  checkIfRulesetHaveField(ruleSet: AppRuleSet, fieldId) {
    if (!ruleSet) return;
    const ifHaveField = ruleSet.rules.some((rule) => {
      if ((rule as AppRuleSet).condition && (rule as AppRuleSet).rules) {
        return this.checkIfRulesetHaveField(rule as AppRuleSet, fieldId);
      } else if ((rule as Rule).field) {
        return (rule as Rule).field === fieldId;
      }
    });
    return ifHaveField;
  }

  onQuestTypeChanged() {
    this.updateIsEditedFlag();
  }

  onGridUpdateChanges() {
    this.updateIsEditedFlag();
  }

  onClickSettings() {
    const dialogRef = this.dialog.open(SettingsPopupComponent, {
      width: BIG_POPUP_WIDTH,
      height: BIG_POPUP_HEIGHT,
      data: this.formVersion ? this.formVersion : null
    });
  }

  addNewField() {
    const dialogRef = this.dialog.open(AddFieldFormComponent, {
      width: BIG_POPUP_WIDTH,
      data: {
        formType: this.formVersion.type
      }
    });

    dialogRef.afterClosed().subscribe((field) => {
      if (field) {
        this.addField(field);
      }
    });
  }

  private addField(input: QuestionField, tabIndex?) {
    this.activeTabIndex = tabIndex !== undefined ? tabIndex : this.activeTabIndex;

    const countRows = countRowsForInput(input);
    const newField: AppGridsterItem = {
      cols: this.defaultCoulmnsNumber,
      rows: countRows,
      y: this.lastRowY + (this.formVersion.tabs[this.activeTabIndex]?.questions.length ? 1 : 0),
      x: 0,
      field: input,
      hasContent: true,
      minItemRows: countRows
    };

    if (input.multiLevelTree) {
      newField.minItemCols = this.defaultCoulmnsNumber;
    }

    this.formVersion.tabs[this.activeTabIndex]?.questions.push(newField);
    this.updateIsEditedFlag();
  }

  removeField(fieldId: string, tabIndex: number) {
    const removedItem = this.formVersion.tabs[tabIndex]?.questions.find((question) => question.field.id === fieldId);

    if (!removedItem) {
      this.snackBar.open('Wystąpił błąd. Nie znaleziono pola.', 'OK');
      return;
    }

    if (this.checkIfFieldUsedOnGraph(removedItem.field)) {
      this.snackBar.open('Nie można usunąć pola, bo jest użyty na warunkach przejść przeplywu stron', 'OK');
      return;
    }

    if (this.processConfig.getInfoOfConnectionToAutoComplete(removedItem.field)) {
      this.snackBar.open(
        `Nie można usunąć pola, bo jest użyte do autouzupełnienia w ${this.processConfig.getInfoOfConnectionToAutoComplete(
          removedItem.field
        )}`,
        'OK'
      );
      return;
    }

    const removedItemIndex = this.formVersion.tabs[tabIndex]?.questions.findIndex(
      (question) => question.field.id === fieldId
    );

    if (removedItemIndex >= 0) {
      this.formVersion.tabs[tabIndex]?.questions.splice(removedItemIndex, 1);
    }

    this.updateIsEditedFlag();
  }

  get lastRowY() {
    let lastRow = 0;
    if (this.formVersion.tabs[this.activeTabIndex]?.questions.length) {
      this.formVersion.tabs[this.activeTabIndex].questions.forEach((v: GridsterItem) => {
        if (v.y > lastRow) lastRow = v.y + (v.rows - 1);
      });
    } else {
      lastRow = 0;
    }
    return lastRow;
  }

  updateIsEditedFlag() {
    this.formService.currentFormVersion = this.formVersion;
    this.isEdited = true;
  }

  saveForm() {
    if (!this.checkIfFormReadyForSave()) return;
    if (this.isLoading) return;
    this.isLoading = true;
    this.trimValues();
    this.formService.removeTemporaryIds();
    this.alignListOfItemsAccordingGrid();
    this.isEditState ? this.editFormVersion() : this.createForm();
  }

  trimValues() {
    this.formVersion.title = this.formVersion.title?.trim();
    this.formVersion.name = this.formVersion.name?.trim();
  }

  checkIfFormReadyForSave() {
    if (this.checkIfDoubleNameAndTitleHasAtLeastTwoChars()) {
      this.snackBar.open('Każda strona musi posiadać unikalną nazwę składającą się z minimum 2 znaków', 'OK');
      return;
    }
    if (this.checkIfEveryPageHasAtLeastOneField()) {
      this.snackBar.open('Każda strona musi zawierać przynajmniej 1 pole', 'OK');
      return;
    }
    if (this.formVersion.enableNavigation && !this.formVersion.tabs?.every((tab) => tab.navigationStepId)) {
      this.snackBar.open('Każda strona musi mieć przypisany krok nawigacji', 'OK');
      return;
    }
    if (
      this.formVersion.type === FormVersionTypes.REGISTRATION &&
      !this.isValidRegisterConfirmationType(this.formVersion.registrationConfirmationType)
    ) {
      if (this.formVersion.registrationConfirmationType === RegistrationConfirmationType.VIA_EMAIL) {
        this.snackBar.open(
          'Wybrałeś sposób potwierdzenia rejestracji poprzez adres e-mail. Musisz wskazać pole imię, nazwisko, email, pesel i identyfikator.',
          'OK'
        );
        return;
      } else if (this.formVersion.registrationConfirmationType === RegistrationConfirmationType.VIA_PZ) {
        this.snackBar.open(
          'Wybrałeś sposób potwierdzenia rejestracji poprzez Profil zaufany. Musisz wskazać pole email, pesel i identyfikator.',
          'OK'
        );
        return;
      }
    }
    return true;
  }

  checkIfDoubleNameAndTitleHasAtLeastTwoChars() {
    let set = new Set();
    return this.formVersion.tabs?.some((el) => {
      if (set.has(el.title) || el.title.length < 2) return true;
      set.add(el.title);
    });
  }

  checkIfEveryPageHasAtLeastOneField() {
    return !this.formVersion.tabs?.every((tab) => tab.questions.length > 0);
  }

  createForm() {
    this.graphController.generateNewFlow();
    this.formService
      .createForm(this.formVersion)
      .subscribe(
        (r: FormVersionFull) => {
          this.formService.clearStorage();
          this.callbackAfterSaveForm(r);
          this.router.navigateByUrl('/');
        },
        (e) => console.error(e)
      )
      .add(() => (this.isLoading = false));
  }

  editFormVersion() {
    this.formService
      .editFormVersion(this.formVersion)
      .subscribe({
        next: (r: FormVersionFull) => this.callbackAfterSaveForm(r),
        error: (err) => {
          if (err.status === 400) {
            this.reloadForm();
          }
        }
      })
      .add(() => (this.isLoading = false));
  }

  callbackAfterSaveForm(resp: FormVersionFull) {
    this.formVersion = resp;
    this.formService.currentFormVersion = resp || this.formVersion;
    this.snackBar.open('Formularz został zapisany!');
    this.isEdited = false;
  }

  setGraphValidationMessage() {
    this.graphValidationMessage = this.graphController.validateGraphAndGetErrorMessage();
  }

  onChangeStatusToPending() {
    if (this.isEdited) {
      this.snackBar.open('Zapisz zmiany przed wykonaniem tej akcji', 'OK');
      return;
    } else if (this.graphValidationMessage) {
      this.snackBar.open(this.graphValidationMessage);
      return;
    }

    this.formService
      .changeFormVersionState(this.formVersion, FormVersionState.PENDING)
      .subscribe(() => this.reloadForm());
  }

  onCreateNewFormVersion() {
    this.formService.createFormVersion(this.formVersion).subscribe(() => {
      this.reloadForm();
    });
  }

  reloadForm() {
    setTimeout(() => {
      this.reloadLatestFormVersion();
      this.formHistoryComponent.reloadFormHistory(true);
    }, 300);
  }

  onClickFetchResults() {
    const dialogRef = this.dialog.open(FetchResultsPopupComponent, {
      width: BIG_POPUP_WIDTH,
      data: this.formVersion
    });
  }

  onAddRepeatingSection() {
    const dialogRef = this.dialog.open(RepeatedSectionPopupComponent, {
      width: BIG_POPUP_WIDTH,
      data: null
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.addRepeatedSection(data);
      }
    });
  }

  addRepeatedSection(data: QuestionField, tabIndex?) {
    this.activeTabIndex = tabIndex !== undefined ? tabIndex : this.activeTabIndex;

    const countRows = countRowsForInput(data);
    const newField: AppGridsterItem = {
      cols: data.repeatingSectionConfig.cols || countColsForRepeatingSection(data),
      rows: data.repeatingSectionConfig.rows || countRows,
      y: this.lastRowY + (this.formVersion.tabs[this.activeTabIndex]?.questions.length ? 1 : 0),
      x: 0,
      field: data,
      hasContent: true,
      minItemRows: countRows,
      resizeEnabled: false
    };

    this.formVersion.tabs[this.activeTabIndex]?.questions.push(newField);
    this.updateIsEditedFlag();
  }

  alignListOfItemsAccordingGrid() {
    this.formVersion.tabs?.forEach((tab: Tab) => {
      const rows: { [key: number]: AppGridsterItem[] } = { 0: [] };
      tab.questions.forEach((item: AppGridsterItem) => {
        if (!Array.isArray(rows[item.y])) {
          rows[item.y] = [];
        }
        rows[item.y].push(item);
      });

      Object.keys(rows).forEach((rowIndex) => {
        const sortedRow = rows[rowIndex].sort(({ x: a }, { x: b }) => a - b);
        tab.questions = Number(rowIndex) === 0 ? [...sortedRow] : [...tab.questions, ...sortedRow];
      });
    });
  }

  originalOrder() {
    return 0;
  }

  onFormVersionTypeChange() {
    this.onQuestTypeChanged();

    if (this.formVersion.type === FormVersionTypes.REGISTRATION && !this.formVersion.registrationConfirmationType) {
      this.formVersion.registrationConfirmationType = RegistrationConfirmationType.VIA_EMAIL;
    }

    if (this.formVersion.type === FormVersionTypes.SERVICE) {
      this.loadServiceConfigs();
    }
  }

  private isValidRegisterConfirmationType(type: RegistrationConfirmationType) {
    const fields = this.formService.getFieldsFlatten();
    const processes = this.formService
      .getProcessesFlatten()
      .filter((process) => process.enabled && process.type === ProcessType.USER_REGISTRATION);
    let fieldsTechNames =
      type === RegistrationConfirmationType.VIA_EMAIL
        ? ['imie', 'nazwisko', 'email', 'pesel', 'identyfikator']
        : ['email', 'pesel', 'identyfikator'];

    for (let i = 0; i < processes.length; i++) {
      const process = processes[i];
      let validDefaultValuesCounter = 0;

      fieldsTechNames.forEach((fieldTechName) => {
        if (fields.find((field) => field.defaultValue === `{{${process.techName}.${fieldTechName}}}`)) {
          validDefaultValuesCounter++;
        }
      });

      if (validDefaultValuesCounter !== fieldsTechNames.length) {
        return false;
      }
    }

    return true;
  }

  onClickDeleteRelatedData() {
    this.formService
      .removeRelatedDataForm(this.formId, this.formVersion.id)
      .subscribe((r) => {
        this.snackBar.open('Powiązane dane zostały usunięte', 'OK');
      })
      .add(() => (this.isLoading = false));
  }

  onChangeTitle() {
    this.updateIsEditedFlag();
    this.formVersion.name = normalizeString(this.formVersion.title);
  }

  ngOnDestroy() {
    if (this.settingsSub) this.settingsSub.unsubscribe();
    if (this.subscription) this.subscription.unsubscribe();
  }

  get isUserForm() {
    if (!this.isEditState) {
      return true;
    }

    return this.currentUserId === this.formVersion.redactorId;
  }

  openPreview(): void {
    const previewUrl = `${this.previewFormUrl}?formVersionId=${this.formVersion?.id}&formId=${this.formVersion?.formId}`;
    window.open(previewUrl, '_blank');
  }
  addNewConfigField() {
    const dialogRef = this.dialog.open(AddConfigFieldFormComponent, {
      width: BIG_POPUP_WIDTH,
      data: {
        formType: this.formVersion.type,
        attributes: this.selectedServiceConfigVersion?.attributes ?? [],
        dictionaries: this.selectedServiceConfigVersion?.dictionaries ?? []
      }
    });

    dialogRef.afterClosed().subscribe((field) => {
      if (field) {
        this.addField(field);
      }
    });
  }

  search(value: string) {
    let query = value.toLowerCase();
    return this.serviceConfigs.filter((config) =>
      `${config.name} ${config.createDate}`.toLocaleLowerCase().includes(query)
    );
  }

  onKey(event: KeyboardEvent) {
    this.filterServiceConfigs = this.search((event.target as HTMLInputElement).value);
  }

  onOpen(ref: MatSelect) {
    const input = ref.panel.nativeElement.querySelector('input') as HTMLInputElement;

    if (input) {
      input.focus();
    }
  }

  onBlur() {
    this.filterServiceConfigs = this.serviceConfigs;
  }

  // Service

  selectedServiceConfig: ServiceConfig;
  selectedServiceConfigVersion: ServiceConfigVersion;

  filterServiceConfigs: ServiceConfig[] = [];
  serviceConfigs: ServiceConfig[] = [];

  serviceConfigSteps: ServiceConfigStep[] = [];
  serviceCharters: ServiceCharter[] = [];

  filterServiceConfigVersions: ServiceConfigVersion[] = [];

  onServiceConfigChange(serviceConfig: ServiceConfig) {
    this.formVersion.serviceId = serviceConfig.id;
    this.filterServiceConfigVersions = [];
    this.serviceConfigSteps = [];
    this.loadServiceConfigVersions(serviceConfig.id);
  }

  onServiceConfigVersionChange(serviceConfigVersion: ServiceConfigVersion) {
    this.formVersion.serviceVersionId = serviceConfigVersion.id;
    this.serviceConfigSteps = serviceConfigVersion.serviceStages;
  }

  private loadServiceConfigs() {
    combineLatest([
      this.serviceConfigService.getServiceConfigs(),
      this.serviceConfigService.getServiceCharters()
    ]).subscribe(([configs, charters]) => {
      this.serviceConfigs = configs;
      this.filterServiceConfigs = configs;
      this.serviceCharters = charters;
      this.serviceConfigs.forEach((config, index) => {
        config.name =
          this.serviceCharters.find((charter) => config.serviceCharterId === charter.id)?.name ??
          'Brak nazwy konfiguracji';
      });

      if (this.formVersion.serviceId) {
        this.selectedServiceConfig = this.serviceConfigs.find((service) => service.id === this.formVersion.serviceId);
      }
    });
  }

  private loadServiceConfigVersions(serviceId: string) {
    this.serviceConfigService.getServiceConfigVersion(serviceId).subscribe((versions) => {
      this.filterServiceConfigVersions = versions;
      if (this.formVersion.serviceVersionId) {
        this.selectedServiceConfigVersion = versions.find(
          (version) => version.id === this.formVersion.serviceVersionId
        );
        this.serviceConfigSteps = this.selectedServiceConfigVersion?.serviceStages || [];
      }
    });
  }
}
