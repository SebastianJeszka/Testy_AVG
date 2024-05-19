import { Component, Optional, Inject, Input, ViewChild } from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';

import { ElementBase } from '../element-base';

@Component({
  selector: 'mc-input-textarea',
  templateUrl: './textarea-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextareaInputComponent,
      multi: true
    }
  ]
})
export class TextareaInputComponent extends ElementBase<string> {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() maxlength: number = 255;
  @Input() rows: number = 2;
  @Input() readOnly: boolean = false;
  @Input() showSymbolsNumber: boolean = true;
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
}
