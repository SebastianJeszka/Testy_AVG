import { Component, ViewChild, OnInit, Input, Optional, Inject, Output, EventEmitter } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { ElementBase } from '../element-base';

@Component({
  selector: 'mc-input-select',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: SelectInputComponent, multi: true }]
})
export class SelectInputComponent extends ElementBase<Array<any>> implements OnInit {
  private _excludedOptions: any[] = [];
  private _options: any[] = [];

  @Output() change = new EventEmitter();
  @Input() multiple: boolean = false;
  @Input() placeholder: string = '';
  @Input() search: boolean = false;
  @Input() optionDisplay: string;
  @Input() optionValue: string;
  @Input() supColumn: string;
  @Input() disabled: boolean;
  @Input() label: string = '';
  @Input() name: string = '';
  @Input()
  set excludedOptions(options: any[]) {
    this._excludedOptions = options;
    this.filterExcludedOptions();
  }
  get excludedOptions(): any[] {
    return this._excludedOptions;
  }

  @Input()
  set options(options: any[]) {
    this._options = options;
    this.filterExcludedOptions();
  }
  get options(): any[] {
    return this._options;
  }

  @Input()
  set errorMessages(obj: { [key: string]: string }) {
    this.customErrorMessages = obj;
  }

  @ViewChild(NgModel) model: NgModel;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>
  ) {
    super(validators, asyncValidators);
  }

  filteredOptions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  ngOnInit() {
    this.filterExcludedOptions();
  }

  filterExcludedOptions() {
    this.filteredOptions.next(this.getAvailableOptions());
  }

  private getAvailableOptions() {
    return this.options.filter((el) => !this.excludedOptions.includes(el)).slice();
  }

  filterOptions(value) {
    this.filteredOptions.next(
      this.getAvailableOptions().filter(
        (option) =>
          (this.optionDisplay ? option[this.optionDisplay] : option)
            .toLowerCase()
            .indexOf((value || '').toLowerCase()) > -1
      )
    );
  }

  onSelectOption() {}
}
