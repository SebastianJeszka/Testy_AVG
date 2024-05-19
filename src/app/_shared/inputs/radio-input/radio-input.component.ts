import { Component, Input, ViewChild, Optional, Inject, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, NgModel, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase } from '../element-base';

@Component({
  selector: 'mc-input-radio',
  templateUrl: './radio-input.component.html',
  styleUrls: ['./radio-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioInputComponent,
      multi: true
    }
  ]
})
export class RadioInputComponent extends ElementBase<string | boolean> implements OnInit {
  @Input() public label: string = '';
  @Input() public name: string = '';
  @Input() public disabled: boolean = false;
  @Input() public set value(v: string | boolean) {
    this._value = v;
  }
  public get value() {
    return this._value;
  }
  private _value;

  @ViewChild(NgModel) model: NgModel;

  radioId: string;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>
  ) {
    super(validators, asyncValidators);
  }

  ngOnInit(): void {
    this.radioId = this.name + this.value;
  }

  private _mValue = null;

  get mValue() {
    return this._mValue;
  }

  set mValue(v) {
    if (!v && v !== false) {
      v = null;
    }
    if (v !== this._mValue) {
      this._mValue = v;
      this.onChange(v);
    }
  }

  writeValue(mValue) {
    this._mValue = mValue;
    this.onChange(mValue);
  }

  onChange = (_) => {};

  onTouched = () => {};

  registerOnChange(fn: (_) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
