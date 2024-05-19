import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';
import { CustomValidators } from '../inputs/custom-validators';

const DIGITS_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DigitsValidateDirective),
  multi: true
};

@Directive({
  selector: '[digits]',
  providers: [DIGITS_VALIDATOR]
})
export class DigitsValidateDirective implements Validator {
  @Input('digits') options: {
    min?: number;
    max?: number;
    maxDecimals?: number;
  } = {};

  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }

    const value: number = control.value;
    const stringValue = value.toString();
    if (isNaN(value) || !CustomValidators.isNumber(stringValue)) {
      return { number: true };
    }
    if (this.options.maxDecimals !== undefined) {
      if (this.options.maxDecimals === 0 && !CustomValidators.isTotalNumber(stringValue)) {
        return { totalNumber: true };
      }
      if (
        this.options.maxDecimals !== 0 &&
        !CustomValidators.isNumberWithDecimalsLimit(stringValue, this.options.maxDecimals)
      ) {
        return { pattern: true };
      }
    }
    if (!isNaN(this.options.min) && !CustomValidators.isGraterOrEqual(value, this.options.min)) {
      return { min: true };
    } else if (!isNaN(this.options.max) && !CustomValidators.isLowerOrEqual(value, this.options.max)) {
      return { max: true };
    }
    return null;
  }
}
