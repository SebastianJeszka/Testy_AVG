import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DictionaryExternalConfig } from 'src/app/_shared/models/dictionary-external-config.model';
import { Dictionary, DictionaryLevelData } from 'src/app/_shared/models/dictionary.model';
import { DictionariesService } from 'src/app/_shared/services/dictionaries.service';

@Component({
  selector: 'dictionary-config-view',
  templateUrl: './dictionary-config-view.component.html',
  styleUrls: ['./dictionary-config-view.component.scss']
})
export class DictionaryConfigViewComponent implements OnInit, OnDestroy {
  isEditing = false;
  newExternalConfig: DictionaryExternalConfig = null;
  newDictionaryLevelsData: DictionaryLevelData[] = [];

  dictionary: Dictionary = null;
  originalDictionary: Dictionary = null; // helper model when editing

  constructor(
    public dialogRef: MatDialogRef<DictionaryConfigViewComponent>,
    @Inject(MAT_DIALOG_DATA) public inputDictionary: Dictionary,
    public dictionaryService: DictionariesService
  ) {}

  ngOnInit(): void {
    this.loadDictionary();
  }

  loadDictionary() {
    this.dictionaryService.getOneDictionary(this.inputDictionary.id).subscribe((dic: Dictionary) => {
      this.dictionary = dic;
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

  onConfigTreeChanged(config: DictionaryExternalConfig) {
    this.newExternalConfig = config;
  }

  onDictionaryLevelsDataChanged(dictionaryLevelsData: DictionaryLevelData[]) {
    this.newDictionaryLevelsData = dictionaryLevelsData;
  }

  onClickEdit() {
    this.isEditing = true;
    this.originalDictionary = this.dictionary;
  }

  onCancelEdit() {
    this.isEditing = false;
    this.dictionary = this.originalDictionary;
    this.dictionary.externalConfig = this.originalDictionary.externalConfig;
    this.dictionary.dictionaryLevelsData = this.originalDictionary.dictionaryLevelsData;
    this.newExternalConfig = null;
  }

  onSave() {
    this.dictionary.externalConfig = this.newExternalConfig;
    this.dictionary.dictionaryLevelsData = this.newDictionaryLevelsData;
    this.dictionaryService.updateDictionary(this.dictionary).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  ngOnDestroy() {
    this.newExternalConfig = null;
    this.isEditing = false;
  }
}
