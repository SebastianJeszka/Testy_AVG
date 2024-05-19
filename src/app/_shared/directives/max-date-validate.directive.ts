import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';
import { CustomValidators } from '../inputs/custom-validators';

const MAX_DATE_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxDateValidateDirective),
  multi: true
};

@Directive({
  selector: '[maxDate]',
  providers: [MAX_DATE_VALIDATOR]
})
export class MaxDateValidateDirective implements Validator {
  @Input() maxDate: Date;

  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    if (this.maxDate && !CustomValidators.dateMax(control.value, this.maxDate)) {
      return { maxDate: true };
    }
    return null;
  }
}
