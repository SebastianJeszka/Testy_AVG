import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  Validators,
} from '@angular/forms';

/**
 * This validator works like "required" but it does not allow whitespace either
 *
 * @export
 * @class NoWhitespaceDirective
 * @implements {Validator}
 */
@Directive({
  selector: '[noSpaces]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NoWhitespaceDirective, multi: true },
  ],
})
export class NoWhitespaceDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
}
