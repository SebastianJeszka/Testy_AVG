import { Directive, forwardRef, Input, Provider } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';

const UNIQUE_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UniqueDirective),
  multi: true
};

@Directive({
  selector: '[unique]',
  providers: [UNIQUE_VALIDATOR]
})
export class UniqueDirective implements Validator {
  @Input('unique') uniqueFn: (value: string) => boolean;

  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    if (this.uniqueFn) {
      if (!this.uniqueFn(control.value)) {
        return { unique: true };
      }
    }
    return null;
  }
}
