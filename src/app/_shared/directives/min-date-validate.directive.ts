import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';
import { CustomValidators } from '../inputs/custom-validators';

const MIN_DATE_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinDateValidateDirective),
  multi: true
};

@Directive({
  selector: '[minDate]',
  providers: [MIN_DATE_VALIDATOR]
})
export class MinDateValidateDirective implements Validator {
  @Input() minDate: Date;

  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    if (this.minDate && !CustomValidators.dateMin(control.value, this.minDate)) {
      return { minDate: true };
    }
    return null;
  }
}
