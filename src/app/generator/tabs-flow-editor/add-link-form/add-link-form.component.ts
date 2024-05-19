import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Edge } from '@swimlane/ngx-graph';
import { QueryBuilderConfig } from 'src/app/external-modules/query-builder/query-builder.interfaces';
import { AppRuleSet, LinkEdge } from 'src/app/_shared/models/link-edge.model';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { FormVersionFull, FormVersionState } from 'src/app/_shared/models/form-version.model';
import { Tab } from 'src/app/_shared/models/tab.model';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { findAndFocusFirstIncorrectInput } from 'src/app/_shared/utils/form.utilits';
import { buildQueryBuilderConfig } from 'src/app/_shared/utils/query-builder-config';
import { getOriginalTabIdFromNode, TabsFlowGraphController } from '../tabs-flow-graph.controller';

@Component({
  selector: 'add-link-form',
  templateUrl: './add-link-form.component.html'
})
export class AddLinkFormComponent implements OnInit {
  @ViewChild(NgForm) ngForm: NgForm;

  @Input()
  set formVersion(formVersion: FormVersionFull) {
    this._tabsForQueryBuilder = formVersion.tabs;
    this._formVersion = formVersion;
  }
  get formVersion() {
    return this._formVersion;
  }

  @Input()
  set startNodeOptions(options: OptionItem[]) {
    this._startNodeOptions = options;
  }
  get startNodeOptions() {
    return this._startNodeOptions;
  }

  @Input()
  set finishNodeOptions(options: OptionItem[]) {
    this._originalFinishOptions = options;
    this._filteredFinishOptions = options;
  }
  get finishNodeOptions() {
    if (this.selectedStart) {
      return this._filteredFinishOptions;
    }
    return this._originalFinishOptions;
  }

  @Input()
  set edge(val: LinkEdge) {
    this._originalEdge = val;
    this._edge = JSON.parse(JSON.stringify(val));
  }
  get edge(): LinkEdge {
    return this._edge;
  }

  @Output() newLink: EventEmitter<Edge> = new EventEmitter<Edge>();
  @Output() removeLink: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() currentQueryConfig: EventEmitter<QueryBuilderConfig> = new EventEmitter<QueryBuilderConfig>();

  private _startNodeOptions: OptionItem[] = [];
  private _originalFinishOptions: OptionItem[] = [];
  private _filteredFinishOptions: OptionItem[] = [];
  private _edge: LinkEdge = null;
  private _originalEdge: LinkEdge = null;
  private _formVersion: FormVersionFull = null;
  private _tabsForQueryBuilder: Tab[] = [];

  isEdition = false;
  isBecameDefault = false;
  isFirstLinkForStartTab = null;
  isSubmitted: boolean = false;
  selectedStart: OptionItem = null;
  selectedGoal: OptionItem = null;
  queryBuilderConfig: QueryBuilderConfig = null;
  processTypes: OptionItem[] = [{ id: 'Pobranie danych', name: 'Pobranie danych' }];
  formVersionState = FormVersionState;
  graphController: TabsFlowGraphController = new TabsFlowGraphController(this);

  constructor(private snackbar: SnackbarService) {}

  ngOnInit(): void {
    if (this.edge) {
      this.isEdition = true;
      this.selectedStart = this.startNodeOptions.filter((opt: OptionItem) => opt.id === this.edge.source)[0];
      this.selectedGoal = this.finishNodeOptions.filter((opt: OptionItem) => opt.id === this.edge.target)[0];
      this.prepareQueryBuilder();
    } else {
      this.queryBuilderConfig = buildQueryBuilderConfig(this._tabsForQueryBuilder);
      this.edge = new LinkEdge();
      if (this.queryBuilderConfig) this.currentQueryConfig.emit(this.queryBuilderConfig);
    }
  }

  onChangeQueryName() {}

  onChangeLinksStart() {
    this.prepareQueryBuilder();
    this.checkIfFirstLinkForTab();
    this._filteredFinishOptions = this.filterFinishNodeOptions();
  }

  onChangeLinksEnd() {
    this.prepareQueryBuilder();
    this.checkIfFirstLinkForTab();
  }

  prepareQueryBuilder() {
    if (this.selectedStart) {
      this.queryBuilderConfig = buildQueryBuilderConfig(this._tabsForQueryBuilder);
      if (this.queryBuilderConfig) this.currentQueryConfig.emit(this.queryBuilderConfig);
      if (this.edge) this.edge.source = this.selectedStart.id;
    }
    if (this.selectedGoal && this.edge) {
      this.edge.target = this.selectedGoal.id;
    }
  }

  checkIfFirstLinkForTab() {
    if (this.selectedStart && this.selectedGoal) {
      this.isFirstLinkForStartTab = !this.formVersion.flow.links.some(
        (l: LinkEdge) => l.source === this.selectedStart.id
      );
      this.edge.data.isDefaultStep = this.isFirstLinkForStartTab;
      if (this.edge.data.isDefaultStep) this.edge.data.query.queryName = 'Domyślny';
    }
  }

  onChangeDefaultStep(e) {
    if (this.isEdition) {
      setTimeout(() => {
        if (this.edge.data.isDefaultStep) {
          this.isBecameDefault = true;
          this.edge.data.query.queryRulesSet = new AppRuleSet();
          this.snackbar.open('Zmieniłeś domyślny krok. Poprzedni domyślny krok dla tej strony już nie jest domyślnym');
        }
      });
    } else {
      if (this.edge.data.isDefaultStep && this.edge?.data?.query) {
        this.edge.data.query.queryName = 'Domyślny';
      } else if (!this.edge.data.isDefaultStep) {
        this.edge.data.query.queryName = '';
      }
    }
  }

  onSave() {
    if (!this.selectedStart || !this.selectedGoal) return;
    this.isSubmitted = true;
    if (!this.ngForm?.valid || (!this.edge.data.isDefaultStep && !this.edge.data.query.queryRulesSet?.rules?.length)) {
      findAndFocusFirstIncorrectInput(this.ngForm);
      return;
    }

    let link: LinkEdge = this.prepareLinkData();
    if (this.isBecameDefault) {
      this.formVersion.flow.links
        .filter((l) => this.edge.source === l.source && l.data.isDefaultStep)
        .forEach((l) => (l.data.isDefaultStep = false));
    }
    if (this.checkIfLinkIsValid(link)) {
      this.newLink.emit(link);
      this.clearValues();
    }
  }

  prepareLinkData(): LinkEdge {
    let link: LinkEdge = null;
    if (!this.isEdition) {
      link = {
        source: this.selectedStart.id,
        target: this.selectedGoal.id,
        label: this.edge.data?.query.queryName || '',
        data: {
          query: this.edge.data.query,
          isDefaultStep: this.edge.data.isDefaultStep
        }
      };
    } else {
      link = this.edge;
    }
    return link;
  }

  checkIfLinkIsValid(link: LinkEdge) {
    if (this.checkIfSameLinkAlreadyExist(link)) {
      return false;
    } else if (this.checkIfExistDefaultLinkForCurrentSource(link)) {
      return false;
    } else if (this.checkIfNewLinkDontStartGrafFromCopyOfNode(link)) {
      return false;
    }
    return true;
  }

  checkIfSameLinkAlreadyExist(inputLink: LinkEdge) {
    if (this.formVersion.flow) {
      const sameLink = this.formVersion.flow.links.filter((link: LinkEdge) => {
        return link.source === inputLink.source && link.target === inputLink.target && link.id !== inputLink.id;
      });

      if (sameLink.length > 0) {
        this.snackbar.open('Taki krok już istnieje', 'Rozumiem');
        return true;
      }
      return false;
    }
    return false;
  }

  checkIfExistDefaultLinkForCurrentSource(inputLink: LinkEdge) {
    if (!this.isEdition && inputLink && inputLink.data?.isDefaultStep) {
      const sameSourceLinks = this.formVersion.flow.links.filter((link: LinkEdge) => inputLink.source === link.source);
      if (sameSourceLinks.length > 0 && sameSourceLinks.some((l: LinkEdge) => l.data.isDefaultStep)) {
        this.snackbar.open(
          'Krok domyślny wychodzący z tej strony już istnieje. Możesz dodać nowy krok, po dodaniu ustawić go jako domyślny'
        );
        return true;
      }
      return false;
    }
    return false;
  }

  checkIfNewLinkDontStartGrafFromCopyOfNode(link: LinkEdge) {
    this.graphController.links.push(link);
    if (
      this.graphController.getPagesThatStartGraph().length === 1 &&
      this.graphController.getPagesThatStartGraph()[0].data.isCopy
    ) {
      this.snackbar.open('Strona początkowa grafa nie może być kopią');
      this.graphController.removeLink(link);
      return true;
    }
    this.graphController.removeLink(link);
    return false;
  }

  clearValues() {
    this.edge = new LinkEdge();
    this.selectedStart = null;
    this.selectedGoal = null;
    this.isEdition = false;
    this.isBecameDefault = false;
    this.isFirstLinkForStartTab = null;
    this.isSubmitted = false;
  }

  getOriginalTabName(name: string) {
    return name.slice(0, name.indexOf('_') > -1 ? name.indexOf('_') : undefined);
  }

  onCancel() {
    this.edge = Object.assign({}, this._originalEdge);
    this.cancel.emit();
  }

  onRemove() {
    this.removeLink.emit(this._originalEdge);
  }

  private filterFinishNodeOptions() {
    if (this.selectedStart) {
      const filteredNodeOptions = this._originalFinishOptions.filter((node: OptionItem) => {
        const originalNodeId = getOriginalTabIdFromNode(node);
        return !this.selectedStart.id.includes(originalNodeId);
      });
      return filteredNodeOptions;
    }
    return [];
  }
}
