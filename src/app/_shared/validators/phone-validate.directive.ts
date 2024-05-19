import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';

const PHONE_NUMBER_REGEX_COMMON = /^[\d\.\-\+\(\) ]{9,}$/;
const PHONE_NUMBER_REGEX = /^\+?\d{9,15}$/;

const PHONE_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => PhoneValidateDirective),
  multi: true
};

function transformPhone(phone): string {
  return phone ? phone.replace(/[^+/0-9]/gi, '') : null;
}

export function isValidPhoneNumber(phone: string): boolean {
  if (!PHONE_NUMBER_REGEX_COMMON.test(phone)) {
    return false;
  }
  const parsedPhone = transformPhone(phone);
  return PHONE_NUMBER_REGEX.test(parsedPhone);
}

@Directive({
  selector: '[phone]',
  providers: [PHONE_VALIDATOR]
})
export class PhoneValidateDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    if (!isValidPhoneNumber(control.value)) {
      return { phone: true };
    }
    return null;
  }
}
