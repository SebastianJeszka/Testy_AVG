import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DictionaryDataController } from './dictionary-data.controller';
import { Branch } from 'src/app/_shared/components/tree/branch.model';
import { SnackbarService } from 'src/app/_shared/services/snackbar.service';
import { DictionaryLevelData } from 'src/app/_shared/models/dictionary.model';

export class FlatNode {
  title: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'dictionary-tree',
  templateUrl: './dictionary-tree.component.html',
  styleUrls: ['./dictionary-tree.component.scss']
})
export class DictionaryTreeComponent {
  @Input()
  set terms(data: Branch[]) {
    this.branchData = data;
    this._dictionaryDataController.initialize(this.branchData);
  }
  @Input() editState = false;
  @Input() dictionaryLevelsData: DictionaryLevelData[] = [];

  branchData: Branch[] = [];

  @Output() treeChanged: EventEmitter<Branch[]> = new EventEmitter();

  addingOption: boolean = false;
  addingSubterm: boolean = false;
  showLevelsDataConfigForm: boolean = false;
  private dictDepth: number = 0;

  _dictionaryDataController: DictionaryDataController = new DictionaryDataController();

  constructor(private snackbar: SnackbarService) {
    this.inits();
  }

  inits() {
    this._dictionaryDataController.dataChange.subscribe((data: Branch[]) => {
      this.branchData = data;
      this.treeChanged.emit(data);
    });
  }

  onAddRootTerm() {
    this.addingOption = true;
  }

  onSaveRootTerm(name: string) {
    if (this._dictionaryDataController.isUnique(name)) {
      this._dictionaryDataController.insertRootTerm(name);
      if (!this.dictionaryLevelsData.length) {
        this.addDictLevel();
        this.dictDepth = 1;
      }
      this.addingOption = false;
    } else {
      this.snackbar.open('Nie można dodać elementu o takiej samej nazwie na tym samym poziomie.');
    }
  }

  cancelSaveTerm() {
    this.addingOption = false;
  }

  private addDepth(currentBranch, currentDepth = 1): void {
    currentBranch.forEach((childBranch) => {
      if (currentDepth > this.dictDepth) {
        this.dictDepth = currentDepth;
      }
      this.addDepth(childBranch.children, currentDepth + 1);
    });
  }

  private addDictLevel(): void {
    this.dictionaryLevelsData.push({
      title: '',
      placeholder: ''
    });
  }

  private calculateDictDepth(): void {
    this.dictDepth = this.branchData.length ? 1 : 0;
    this.addDepth(this.branchData);
  }

  private shouldAddDictLevel(): boolean {
    this.calculateDictDepth();
    return this.dictDepth > this.dictionaryLevelsData.length;
  }

  private shouldRemoveDictLevel(): boolean {
    this.calculateDictDepth();
    return this.dictDepth < this.dictionaryLevelsData.length;
  }

  addSubTerm(data: { title: string; parent: Branch }) {
    if (this._dictionaryDataController.isUnique(data.title, data.parent)) {
      this._dictionaryDataController.insertSubTerm(data.parent, data.title);
      if (this.shouldAddDictLevel()) {
        this.addDictLevel();
      }
    } else {
      this.snackbar.open('Nie można dodać elementu o takiej samej nazwie na tym samym poziomie.');
    }
  }

  onRemoveTerm(branch: Branch) {
    this._dictionaryDataController.removeTerm(branch);
    if (this.shouldRemoveDictLevel()) {
      this.dictionaryLevelsData = this.dictionaryLevelsData.slice(0, this.dictDepth);
    }
  }
}
