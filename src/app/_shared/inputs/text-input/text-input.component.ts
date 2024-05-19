import { Component, Optional, Inject, Input, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';

import { ElementBase } from '../element-base';

export enum MaskType {
  number = 'number'
}

@Component({
  selector: 'mc-input-text',
  templateUrl: './text-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextInputComponent,
      multi: true
    }
  ],
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent extends ElementBase<string> implements AfterViewInit {
  @Input() public label: string = '';
  @Input() public name: string = '';
  @Input() public disabled: boolean = false;
  @Input() public placeholder: string = '';
  @Input() public type: string = 'text';
  @Input() public maxlength: number = 255;
  @Input() autoFocus: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() defaultStyles: boolean = false;
  @Input()
  set errorMessages(obj: { [key: string]: string }) {
    this.customErrorMessages = obj;
  }

  dropSpecialCharacters = true;
  inputMask: string;

  @ViewChild(NgModel) model: NgModel;
  @ViewChild('input') input: ElementRef;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>
  ) {
    super(validators, asyncValidators);
  }

  ngAfterViewInit(): void {
    if (this.autoFocus && this.input) {
      setTimeout(() => this.input.nativeElement.focus());
    }
  }
}
