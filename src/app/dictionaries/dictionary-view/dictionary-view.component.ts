import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Branch } from 'src/app/_shared/components/tree/branch.model';
import { Dictionary } from 'src/app/_shared/models/dictionary.model';
import { DictionariesService } from '../../_shared/services/dictionaries.service';
import { DictionaryDataController } from '../dictionary-tree/dictionary-data.controller';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dictionary-view',
  templateUrl: './dictionary-view.component.html',
  styleUrls: ['./dictionary-view.component.scss']
})
export class DictionaryViewComponent implements OnInit, OnDestroy {
  isEditing = false;
  newTreeData: Branch[] = [];
  dictionary: Dictionary = null;
  originalDictionary: Dictionary = null; // helper model when editing
  _dictionaryDataController: DictionaryDataController = new DictionaryDataController();

  constructor(
    public dialogRef: MatDialogRef<DictionaryViewComponent>,
    @Inject(MAT_DIALOG_DATA) public inputDictionary: Dictionary,
    public dictionaryService: DictionariesService
  ) {}

  ngOnInit(): void {
    this.loadDictionary();
  }

  loadDictionary() {
    this.dictionaryService.getOneDictionary(this.inputDictionary.id).subscribe((dic: Dictionary) => {
      this.dictionary = dic;
      if (!this.dictionary.dictionaryLevelsData) {
        this.dictionary.dictionaryLevelsData = [];
      }
    });
  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onRemoveDictionary() {
    this.dictionaryService.removeDictionary(this.dictionary).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onTreeChanged(dataTree: Branch[]) {
    this.newTreeData = dataTree;
  }

  onClickEdit() {
    this.isEditing = true;
    this.originalDictionary = Object.assign({}, this.dictionary);
  }

  onCancelEdit() {
    this.isEditing = false;
    this.dictionary = Object.assign({}, this.originalDictionary);
    this.dictionary.children = [];
    setTimeout(() => (this.dictionary.children = this.originalDictionary.children));
    this.newTreeData = null;
  }

  onSave() {
    this.dictionary.children = this.newTreeData;
    this.dictionaryService.updateDictionary(this.dictionary).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  ngOnDestroy() {
    this.newTreeData = [];
    this.isEditing = false;
  }
}
