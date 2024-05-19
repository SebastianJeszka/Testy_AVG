import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const EMAIL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => EmailValidateDirective),
  multi: true
};

export function isValidEmail(email): boolean {
  return EMAIL_REGEX.test(email);
}

@Directive({
  selector: '[email]',
  providers: [EMAIL_VALIDATOR]
})
export class EmailValidateDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    if (!isValidEmail(control.value)) {
      return { email: true };
    }
    return null;
  }
}
