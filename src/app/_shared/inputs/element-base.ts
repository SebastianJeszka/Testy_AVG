import { NgModel, RequiredValidator } from '@angular/forms';
import { Observable, of, map } from 'rxjs';
import { ValueAccessorBase } from './value-accessor';
import {
  AsyncValidatorArray,
  ValidatorArray,
  ValidationResult,
  message,
  validate,
  MyErrorStateMatcher
} from './validation-utils';

export abstract class ElementBase<T> extends ValueAccessorBase<T> {
  protected abstract model: NgModel;
  private init = false;
  protected customErrorMessages: { [key: string]: string } = {};
  required: boolean;
  stateMatcher = new MyErrorStateMatcher();

  constructor(private validators: ValidatorArray, private asyncValidators: AsyncValidatorArray) {
    super();
    this.required = validators && !!validators.find((v) => v instanceof RequiredValidator);
    setTimeout(() => {
      this.init = true;
    }, 0);
  }

  private validate(): Observable<ValidationResult> {
    if (this.init && this.model.touched) {
      return validate(this.validators, this.asyncValidators)(this.model.control);
    } else {
      return of();
    }
  }

  public get invalid(): Observable<boolean> {
    return this.validate().pipe(map((v) => Object.keys(v || {}).length > 0));
  }

  public get failures(): Observable<Array<string>> {
    return this.validate().pipe(
      map((_validator) =>
        Object.keys(_validator).map((key) => this.customErrorMessages[key] || message(_validator, key))
      )
    );
  }
}
