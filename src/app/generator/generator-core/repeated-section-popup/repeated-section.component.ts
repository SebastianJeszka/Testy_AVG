import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GridsterComponent, GridsterConfig } from 'angular-gridster2';
import { Subscription } from 'rxjs';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import {
  QuestionField,
  QuestionFieldState,
  QuestionFieldStates,
  RepeatingSectionViewType,
  RepeatingSectionConfig,
  stateLabels
} from 'src/app/_shared/models/question-field.model';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { AppGridsterItem } from 'src/app/_shared/models/tab.model';
import { FormService } from 'src/app/_shared/services/form.service';
import { findAndFocusFirstIncorrectInput } from 'src/app/_shared/utils/form.utilits';
import { GridsterConfigController } from 'src/app/_shared/utils/gridster-config.controller';
import { normalizeString } from 'src/app/_shared/utils/normalize-string.utilits';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { FieldStateQueryComponent } from '../../field-state-query-popup/field-state-query.component';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { getTemporaryId } from 'src/app/_shared/utils/unique-id.utilits';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'repeated-section-popup',
  templateUrl: './repeated-section.component.html',
  styleUrls: ['./repeated-section.component.scss']
})
export class RepeatedSectionPopupComponent implements OnInit, OnDestroy {
  @ViewChild('gridster') gridster: GridsterComponent;
  @ViewChild('sectionForm', { static: true }) ngForm: NgForm;

  field: QuestionField = null;

  oneRowHeight: number = 170;
  containerHeight: number = this.oneRowHeight;
  defaultCoulmnsNumber = 3;

  gridConfig: GridsterConfig;
  items: AppGridsterItem[] = [];
  statesOptionItems: OptionItem[] = [
    {
      id: QuestionFieldStates.HIDDEN,
      name: stateLabels[QuestionFieldStates.HIDDEN]
    }
  ];

  allFieldsValid: boolean = true;
  isFormValid: boolean = false;
  isEdition: boolean = false;
  isOpenQueryBuilder: boolean = false;

  validationSub: Subscription;

  repeatingSectionConfig: RepeatingSectionConfig = new RepeatingSectionConfig();
  RepeatingSectionViewType = RepeatingSectionViewType;

  gridsterController: GridsterConfigController;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RepeatedSectionPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { formType: FormVersionTypes; input?: QuestionField },
    public formService: FormService,
    public snackBar: SnackbarService
  ) {
    this.gridsterController = new GridsterConfigController(this);
  }

  get allowTechNameChange(): boolean {
    return this.formService.isAllowedChangeTechName(this.data?.input);
  }

  ngOnInit(): void {
    this.isEdition = this.data?.input ? true : false;

    if (this.isEdition) {
      this.field = JSON.parse(JSON.stringify(this.data.input));
      this.repeatingSectionConfig = this.data.input.repeatingSectionConfig
        ? Object.assign({}, this.data.input.repeatingSectionConfig)
        : new RepeatingSectionConfig();
      this.items = this.field.repeatingSectionGrid.map((o) => o);
      this.gridsterController.onUpdateChanges();
    } else {
      this.field = new QuestionField();
      this.field.type = FieldTypes.REPEATING_SECTION;
      this.addItem();
    }

    this.initGridConfig();

    this.validationSub = this.ngForm.statusChanges.subscribe((value: 'VALID' | 'INVALID') => {
      this.isFormValid = value === 'VALID';
    });
    this.isOpenQueryBuilder = this.field.states?.length > 0;
  }

  onSave() {
    this.allFieldsValid = this.checkIfAllFieldsValid();
    if (this.ngForm.invalid) {
      findAndFocusFirstIncorrectInput(this.ngForm);
      return;
    }
    if (this.allFieldsValid) {
      this.field.repeatingSectionConfig = this.repeatingSectionConfig;
      this.field.repeatingSectionGrid = this.items;
      this.field.repeatingSectionConfig.rows = this.rowNumber + 1;
      this.field.repeatingSectionConfig.cols = this.colsNumber;
      this.field.repeatingSectionConfig.oneItemRequired = this.detectIfAtLeastOneItemRequired();
      if (!this.field.id) {
        this.field.id = getTemporaryId(this.formService.currentFormVersion);
      }
      this.dialogRef.close(this.field);
    }
  }

  detectIfAtLeastOneItemRequired() {
    return this.field.repeatingSectionGrid.some(
      (sectionItem: AppGridsterItem) => sectionItem.field.validation?.required
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  checkIfAllFieldsValid() {
    return this.items.every((item: AppGridsterItem) => item.field.techName && item.field.type);
  }

  get rowNumber(): number {
    return this.items?.length ? this.gridster.rows : 0;
  }

  get colsNumber(): number {
    return this.items?.length ? this.gridster.columns : 0;
  }

  removeItem(fieldId: string) {
    const removedItemIndex = this.items.findIndex((item) => item.field.id === fieldId);

    if (removedItemIndex < 0) {
      this.snackBar.open('Wystąpił błąd. Nie znaleziono pola.', 'OK');
      return;
    }

    this.items.splice(removedItemIndex, 1);
    this.gridsterController.calculateContainerHeight();
  }

  addItem() {
    let item = {
      cols: this.defaultCoulmnsNumber,
      rows: 1,
      y: 0,
      x: 0,
      field: new QuestionField()
    };
    if (!item.field.id) item.field.id = getTemporaryId(this.formService.currentFormVersion);
    this.items.push(item);
    this.gridsterController.calculateContainerHeight();
  }

  initGridConfig() {
    const config = this.gridsterController.getConfig();
    config.fixedRowHeight = this.oneRowHeight;
    this.gridConfig = config;
  }

  onItemChanged(): void {
    this.gridConfig.api && this.gridConfig.api.optionsChanged();
    this.gridsterController.onUpdateChanges();
  }

  onChangeTitle() {
    this.field.techName = normalizeString(this.field.title);
  }

  onChangeTechName() {
    this.field.techName = normalizeString(this.field.techName);
  }

  onToggleDynamicStates() {
    if (this.isOpenQueryBuilder) {
      if (!this.field.states?.length) {
        this.field.states = [
          {
            type: null,
            query: ''
          }
        ];
      }
    }
  }

  getStateLabel(stateType: string) {
    return stateLabels[stateType];
  }

  openStateQueryJsonEdition(state: QuestionFieldState) {
    const dialogRef = this.dialog.open(FieldStateQueryComponent, {
      width: '1960px',
      height: '95vh',
      maxWidth: '90vw',
      data: state.query,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((query: string) => {
      if (query) {
        state.query = query;
      }
    });
  }

  ngOnDestroy() {
    if (this.validationSub) this.validationSub.unsubscribe();
  }
}
