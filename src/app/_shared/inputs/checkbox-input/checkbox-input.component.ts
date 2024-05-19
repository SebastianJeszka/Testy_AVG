import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'mc-input-checkbox',
  templateUrl: './checkbox-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxInputComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxInputComponent),
      multi: true
    }
  ]
})
export class CheckboxInputComponent implements ControlValueAccessor, OnInit {
  @Input() name;
  @Input() disabled = false;
  @Input() checked = null;
  @Input() required: boolean | string = false;
  @Input() showRequiredMark: boolean = true;

  private _value = false;

  @Output() changedManually: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    this.value = !!this.checked;
    if (this.required === '') {
      this.required = true;
    }
  }

  changedManuallyHandler(e) {
    this.changedManually.emit(e);
  }

  get value() {
    return this._value;
  }

  set value(v) {
    if (!v) {
      v = false;
    }
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  public toggleValue(): void {
    this.value = !this.value;
  }

  writeValue(value) {
    setTimeout(() => {
      if (this._value === null && this.checked) {
        this.value = this.checked;
      }
    });
    this._value = value;
    this.onChange(value);
  }

  onChange = (_) => {};

  onTouched = () => {};

  registerOnChange(fn: (_) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  validate(c: UntypedFormControl) {
    if (!c.value && this.required) {
      return { required: true };
    }
  }
}
