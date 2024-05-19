import { OnInit, Component, ViewChild } from '@angular/core';
import { Dictionary, DictionaryLevelData } from 'src/app/_shared/models/dictionary.model';
import { DictionariesService } from '../../_shared/services/dictionaries.service';
import { MatTree } from '@angular/material/tree';
import { Branch } from 'src/app/_shared/components/tree/branch.model';
import { DictionaryExternalConfig } from 'src/app/_shared/models/dictionary-external-config.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'add-dictionary',
  templateUrl: './add-dictionary.component.html',
  styleUrls: ['./add-dictionary.component.scss']
})
export class AddDictionaryComponent implements OnInit {
  parents: Dictionary[] = [];
  parentsIds: number = 0;

  dictionary: Dictionary = null;
  newTreeData: Branch[] = [];
  newExternalConfig: DictionaryExternalConfig = null;
  newDictionaryLevelsData: DictionaryLevelData[] = [];
  externalApiEnabled: boolean = false;

  @ViewChild('tree') tree: MatTree<Branch>;

  constructor(public dialogRef: MatDialogRef<AddDictionaryComponent>, public dictionaryService: DictionariesService) {}

  ngOnInit(): void {
    this.dictionary = new Dictionary();
  }

  toggleExternalApiCheckbox() {
    if (this.externalApiEnabled) {
      this.dictionary.children = [];
    } else {
      this.dictionary.externalConfig = null;
    }
  }

  get NumbersOfParents() {
    return Object.keys(this.parentsIds).length;
  }

  onTreeChanged(dataTree: Branch[]) {
    this.newTreeData = dataTree;
  }

  onConfigTreeChanged(config: DictionaryExternalConfig) {
    this.newExternalConfig = config;
  }

  onDictionaryLevelsDataChanged(dictionaryLevelsData: DictionaryLevelData[]) {
    this.newDictionaryLevelsData = dictionaryLevelsData;
  }

  onAddDictionary() {
    this.dictionary.children = this.newTreeData;
    if (this.newExternalConfig) {
      this.dictionary.externalConfig = this.newExternalConfig;
    }
    if (this.newDictionaryLevelsData) {
      this.dictionary.dictionaryLevelsData = this.newDictionaryLevelsData;
    }
    this.dictionaryService.addDictionary(this.dictionary).subscribe((newDictionary) => {
      this.dialogRef.close(newDictionary);
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
