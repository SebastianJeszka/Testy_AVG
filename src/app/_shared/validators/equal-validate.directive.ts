import { Directive, forwardRef, Input, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

const EQUAL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => EqualValidateDirective),
  multi: true
};

@Directive({
  selector: '[equalTo]',
  providers: [EQUAL_VALIDATOR]
})
export class EqualValidateDirective implements Validator, OnDestroy {
  @Input() equalToName: string = null;
  @Input('equalTo') equalToValue: string = null;

  private valueChangesSub: Subscription;

  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    const value = control.value;
    const otherControl = control.root.get(this.equalToName);
    if (otherControl) {
      this.ngOnDestroy();
      this.valueChangesSub = otherControl.valueChanges.subscribe(() => {
        if (value !== otherControl.value) {
          control.setErrors({ equalTo: true });
        } else {
          if (control.hasError('equalTo')) {
            delete control.errors['equalTo'];
            if (!Object.keys(control.errors).length) {
              control.setErrors(null);
            }
          }
        }
      });
      if (value !== otherControl.value) {
        return { equalTo: true };
      }
    } else if (value !== this.equalToValue) {
      return { equalTo: true };
    }
    return null;
  }

  ngOnDestroy(): void {
    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }
  }
}
