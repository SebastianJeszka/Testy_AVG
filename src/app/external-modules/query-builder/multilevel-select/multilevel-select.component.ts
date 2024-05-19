import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from '../query-builder.interfaces';

@Component({
  selector: 'multilevel-select',
  templateUrl: './multilevel-select.component.html'
})
export class MultiLevelSelectComponent implements OnInit {
  @Input() options: Option[] = [];
  @Input() values: string[] = null;

  optionsLevels: Option[][] = [];
  _values: string[] = [];

  @Output() changed: EventEmitter<string[]> = new EventEmitter<string[]>();

  ngOnInit(): void {
    this._values = this.values?.length && Array.isArray(this.values) ? this.values.map((r) => r) : [];
    this.initOptionLevels();
  }

  initOptionLevels() {
    if (this._values?.length > 0 && this.options?.length > 0) {
      let currentOptions = this.options;
      this.values.forEach((value: string, i) => {
        let option = currentOptions.filter((opt: Option) => opt.name === value)[0];
        if (option.children?.length > 0) {
          this.optionsLevels[i] = option.children;
          currentOptions = option.children;
        }
      });
    }
  }

  onModelChange(optionId, levelIndex, optionsList?: Option[]) {
    const option: Option =
      levelIndex === 0
        ? this.options.filter((o) => o.value === optionId)[0]
        : optionsList
        ? optionsList.filter((o) => o.value === optionId)[0]
        : null;
    if (!option) return;
    if (this.optionsLevels[levelIndex]) {
      this.optionsLevels.splice(levelIndex);
    }
    if (option.children?.length) {
      this.optionsLevels.splice(levelIndex, 0, option.children);
    }
    this._values[levelIndex + 1] = '';
    if (Object.keys(this._values).length > levelIndex + 1) {
      Object.keys(this._values).forEach((i) => {
        if (i > levelIndex + 1) {
          this._values[i] = '';
        }
      });
    }
    if (levelIndex === 0) {
      this._values[levelIndex] = optionId;
    }
    this.changed.emit(this._values.filter((r) => !!r));
  }
}
