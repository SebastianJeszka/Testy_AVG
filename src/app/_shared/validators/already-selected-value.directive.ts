import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

const ENIQUE_TECH_NAME_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => AlreadySelectedValueDirective),
  multi: true
};

@Directive({
  selector: '[alreadySelectedValue]',
  providers: [ENIQUE_TECH_NAME_VALIDATOR]
})
export class AlreadySelectedValueDirective implements Validator {
  @Input('alreadySelectedValue') checkIfSelectedFunc: Function;
  @Input() index: number;

  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    if (this.checkIfSelectedFunc && this.checkIfSelectedFunc(control.value, this.index)) {
      return { alreadySelected: true };
    }
  }
}
