import {
  AbstractControl,
  AsyncValidatorFn,
  Validator,
  Validators,
  ValidatorFn,
  UntypedFormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';

import { of } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';

export type ValidationResult = { [validator: string]: string | boolean };

export type AsyncValidatorArray = Array<Validator | AsyncValidatorFn>;

export type ValidatorArray = Array<Validator | ValidatorFn>;

const normalizeValidator = (validator: Validator | ValidatorFn): ValidatorFn | AsyncValidatorFn => {
  const func = (validator as Validator).validate.bind(validator);
  if (typeof func === 'function') {
    return (c: AbstractControl) => func(c);
  } else {
    return <ValidatorFn | AsyncValidatorFn>validator;
  }
};

export const composeValidators = (validators: ValidatorArray): AsyncValidatorFn | ValidatorFn => {
  if (validators == null || validators.length === 0) {
    return null;
  }
  return Validators.compose(validators.map(normalizeValidator));
};

export const validate = (validators: ValidatorArray, asyncValidators: AsyncValidatorArray) => {
  return (control: AbstractControl) => {
    const synchronousValid = () => composeValidators(validators)(control);

    if (asyncValidators) {
      const asyncValidator = composeValidators(asyncValidators);

      return asyncValidator(control).map((v) => {
        const secondary = synchronousValid();
        if (secondary || v) {
          // compose async and sync validator results
          return Object.assign({}, secondary, v);
        }
      });
    }

    if (validators) {
      return of(synchronousValid());
    }

    return of(null);
  };
};

export const message = (validator: ValidationResult, key: string): string => {
  switch (key) {
    case 'required':
      return 'Pole jest wymagane';
    case 'pattern':
      return 'Niepoprawny format';
    case 'email':
      return 'Niepoprawny adres e-mail';
    case 'phone':
      return 'Niepoprawny numer telefonu';
    case 'text':
      return 'Wartość nie może zawierać liczb i znaków specjalnych';
    case 'postalCode':
      return 'Niepoprawny kod pocztowy';
    case 'pesel':
      return 'Niepoprawny numer PESEL';
    case 'peselOrNip':
      return 'Niepoprawny numer pesel lub nip';
    case 'nip':
      return 'Niepoprawny numer NIP';
    case 'number':
      return 'Wartość musi być liczbą';
    case 'totalNumber':
      return 'Wartość musi być liczbą całkowitą';
    case 'max':
      return 'Wartość jest zbyt duża';
    case 'maxArea':
      return 'Wprowadzona wartość jest większa niż pozostała powierzchnia działki';
    case 'min':
      return 'Wartość jest zbyt mała';
    case 'minlength':
      return `Minimalna ilość znaków: ${Number(validator.minlength['requiredLength'])}`;
    case 'maxlength':
      return 'Pole powinno mieć mniej niż N znaków';
    case 'equalTo':
      return 'Pole powinno się równać';
    case 'notEqual':
      return 'Pole nie powinno się równać';
  }

  switch (typeof validator[key]) {
    case 'string':
      return <string>validator[key];
    default:
      return `Błąd walidacji: ${key}`;
  }
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
