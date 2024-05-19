import { Component, Inject, OnInit } from '@angular/core';
import { DictionariesService } from 'src/app/_shared/services/dictionaries.service';
import { Dictionary } from 'src/app/_shared/models/dictionary.model';
import { List } from 'src/app/_shared/models/list.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { Branch } from 'src/app/_shared/components/tree/branch.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'import-dictionaries',
  templateUrl: './import-dictionaries.component.html',
  styleUrls: ['./import-dictionaries.component.scss']
})
export class ImportDictionariesComponent implements OnInit {
  dictionaries: Dictionary[] = [];

  constructor(
    private dialogRef: MatDialogRef<ImportDictionariesComponent>,
    private dictionaryService: DictionariesService,
    @Inject(MAT_DIALOG_DATA) public data: { type: FieldTypes }
  ) {}

  ngOnInit(): void {
    this.loadDictionaries();
  }

  loadDictionaries() {
    this.dictionaryService.getList().subscribe((resp: List<Dictionary>) => {
      if (this.data.type !== FieldTypes.SELECT) {
        this.dictionaries = resp.items.filter(
          (dictionary: Dictionary) => !dictionary.children.some((branch: Branch) => branch.children?.length > 0)
        );
      } else {
        this.dictionaries = resp.items;
      }
    });
  }

  onChoseDictionary(dictionary) {
    this.dialogRef.close(dictionary);
  }

  public trackById(item: Dictionary) {
    return item.id;
  }
}
