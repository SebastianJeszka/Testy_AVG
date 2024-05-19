import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DictionaryExternalConfig } from 'src/app/_shared/models/dictionary-external-config.model';
import { DictionaryLevelData } from 'src/app/_shared/models/dictionary.model';

@Component({
  selector: 'dictionary-config-item',
  templateUrl: './dictionary-config-item.component.html',
  styleUrls: ['./dictionary-config-item.component.scss']
})
export class DictionaryConfigItemComponent {
  @Input() config: DictionaryExternalConfig;
  @Input() dictLevel: number;
  @Input() editState: boolean;
  @Input() addNewDictState: boolean;
  @Input() dictionaryLevelsData: DictionaryLevelData[];
  @Output() add: EventEmitter<{ config; dictionaryLevelData }> = new EventEmitter();
  @Output() remove: EventEmitter<DictionaryExternalConfig> = new EventEmitter();

  showActions: boolean = false;
  childConfigFormVisible: boolean = false;

  toggleActions() {
    this.showActions = !this.showActions;
    this.childConfigFormVisible = false;
  }

  toggleShowConfigForm() {
    this.childConfigFormVisible = !this.childConfigFormVisible;
  }

  saveChildConfig({ config, dictionaryLevelData }) {
    if (config || dictionaryLevelData) {
      this.add.emit({ config, dictionaryLevelData });
      this.toggleActions();
    }
  }

  removeCurrentConfig() {
    this.remove.emit(this.config);
  }

  toggleEditState() {
    this.editState = !this.editState;
  }
}
