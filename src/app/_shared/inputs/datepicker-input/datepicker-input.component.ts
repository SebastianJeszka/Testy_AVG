import { Component, Input, ViewChild, Optional, Inject, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgModel, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase } from '../element-base';

@Component({
  selector: 'mc-input-datepicker',
  templateUrl: './datepicker-input.component.html',
  styleUrls: ['./datepicker-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatePickerInputComponent,
      multi: true
    }
  ]
})
export class DatePickerInputComponent extends ElementBase<string> {
  @Input() label: string = '';
  @Input() format: string = 'dd/mm/rrrr';
  @Input() name: string = '';
  @Input() disabled = false;
  @Output() _changed = new EventEmitter();
  @ViewChild(NgModel) model: NgModel;

  @Input() minDate: Date = null;
  @Input() maxDate: Date = null;
  @Input() withTime: boolean = false;

  @Input()
  set errorMessages(obj: { [key: string]: string }) {
    this.customErrorMessages = obj;
  }

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>
  ) {
    super(validators, asyncValidators);
  }

  dateChanged() {
    this._changed.emit();
  }
}
