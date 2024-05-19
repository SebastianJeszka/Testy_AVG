import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatisticService } from '../../_shared/services/statistic.service';
import {
  StatisticDataDto,
  StatisticFormDto,
  StatisticForm,
  StatisticOptions
} from '../../_shared/models/statistic.model';
import { Observable } from 'rxjs';
import { QueryBuilderClassNames } from '../../external-modules/query-builder/query-builder.interfaces';
import { BIG_POPUP_HEIGHT, BIG_POPUP_WIDTH } from '../../_shared/consts';
import { StatisticPreviewPopupComponent } from './statistic-preview-popup/statistic-preview-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {
  public defaultClassNames: QueryBuilderClassNames = {
    arrowIconButton: 'q-arrow-icon-button',
    arrowIcon: 'q-icon q-arrow-icon',
    removeIcon: 'q-icon q-remove-icon',
    addIcon: 'q-icon q-add-icon',
    button: 'q-button',
    buttonGroup: 'q-button-group',
    removeButton: 'q-remove-button',
    switchGroup: 'q-switch-group',
    switchLabel: 'q-switch-label',
    switchRadio: 'q-switch-radio',
    rightAlign: 'q-right-align',
    transition: 'q-transition',
    collapsed: 'q-collapsed',
    treeContainer: 'q-tree-container',
    tree: 'q-tree',
    row: 'q-row',
    connector: 'q-connector',
    rule: 'q-rule',
    ruleSet: 'q-ruleset',
    invalidRuleSet: 'q-invalid-ruleset',
    emptyWarning: 'q-empty-warning',
    fieldControl: 'q-field-control',
    fieldControlSize: 'q-control-size',
    entityControl: 'q-entity-control',
    entityControlSize: 'q-control-size',
    operatorControl: 'q-operator-control',
    operatorControlSize: 'q-control-size',
    inputControl: 'q-input-control',
    inputControlSize: 'q-control-size'
  };

  statisticOptions: StatisticOptions[];
  filterStatisticOptions: StatisticOptions[];
  statisticFormDto: StatisticFormDto = new StatisticFormDto();
  statisticDataDtos: StatisticDataDto[];
  counter: number = 1;

  formId: string;
  formVersionId: string;
  isEdited = false;

  currentTabId: string = null;

  constructor(
    private statisticService: StatisticService,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.isEdited;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.formId = this.activeRoute.snapshot.params['id'];
    this.formVersionId = this.activeRoute.snapshot.queryParams['formVersionId'];
    this.currentTabId = this.activeRoute.snapshot.queryParams['currentTabId'];
    if (this.formId) {
      this.statisticService.getStatisticFields(this.formVersionId).subscribe((statisticOptions: StatisticOptions[]) => {
        this.statisticOptions = statisticOptions;
        this.filterStatisticOptions = statisticOptions;
      });
    }
  }

  onAddStatistic() {
    this.statisticFormDto.statisticForm.push(new StatisticForm(this.counter++));
    this.resetStatistic();
  }

  getStatistic() {
    this.statisticService
      .getStatisticData(this.statisticFormDto)
      .subscribe((statisticDataDtos) => (this.statisticDataDtos = statisticDataDtos));
  }

  search(value: string) {
    let query = value.toLowerCase();
    return this.statisticOptions.filter((option) =>
      `${option.pageTitle} ${option.fieldTitle}`.toLocaleLowerCase().includes(query)
    );
  }

  onKey(event: KeyboardEvent) {
    this.filterStatisticOptions = this.search((event.target as HTMLInputElement).value);
  }

  onBlur() {
    this.filterStatisticOptions = this.statisticOptions;
  }

  onChangeField() {
    this.resetStatistic();
  }

  resetStatistic() {
    this.statisticDataDtos = null;
  }

  removeStatistic(index) {
    this.statisticFormDto.statisticForm.splice(index, 1);
  }

  onOpen(ref: MatSelect) {
    const input = ref.panel.nativeElement.querySelector('input') as HTMLInputElement;

    if (input) {
      input.focus();
    }
  }

  getClassNames(...args): string {
    const classNames = args.map((id) => this.defaultClassNames[id]).filter((c) => !!c);
    return classNames.length ? classNames.join(' ') : null;
  }

  onClickPreview(statisticForm: StatisticForm) {
    let statisticDataDto = this.statisticDataDtos.find((s) => s.id === statisticForm.id);

    let leftFieldTitle = this.statisticOptions.find(
      (s) => s.questionFieldId === statisticForm.leftGroupingQuestionFieldId
    ).fieldTitle;
    let rightFieldTitle = this.statisticOptions.find(
      (s) => s.questionFieldId === statisticForm.rightGroupingQuestionFieldId
    )?.fieldTitle;

    const dialogRef = this.dialog.open(StatisticPreviewPopupComponent, {
      width: BIG_POPUP_WIDTH,
      height: BIG_POPUP_HEIGHT,
      data: { statisticDataDto, statisticForm, leftFieldTitle, rightFieldTitle }
    });
  }
}
