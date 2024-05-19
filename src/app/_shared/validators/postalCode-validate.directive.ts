import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';

const POSTAL_CODE_REGEX = /^\d{2}-\d{3}$/;

const POSTAL_CODE_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => PostalCodeValidateDirective),
  multi: true
};

export function isValidPostalCode(postalCode): boolean {
  return POSTAL_CODE_REGEX.test(postalCode);
}

@Directive({
  selector: '[postalCode]',
  providers: [POSTAL_CODE_VALIDATOR]
})
export class PostalCodeValidateDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    if (!isValidPostalCode(control.value)) {
      return { postalCode: true };
    }
    return null;
  }
}
