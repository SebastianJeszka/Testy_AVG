import { Directive, forwardRef, Input, Provider } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

const TECH_NAME_VALIDATOR: Provider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UsedTechNameAvailableDirective),
  multi: true
};
@Directive({
  selector: '[validAvailableTechName]',
  providers: [TECH_NAME_VALIDATOR]
})
export class UsedTechNameAvailableDirective implements Validator {
  @Input() availableTechNames: string[] = [];

  getDiffUsedAndAvailableTechName(inputValue: string, availableTechNames: string[]): string[] {
    const regexp = new RegExp('{{([a-z0-9_]+)}}', 'gi');
    let match = regexp.exec(inputValue);
    const useTechNames: string[] = [];

    while (match !== null) {
      useTechNames.push(match[1]);
      match = regexp.exec(inputValue);
    }
    return useTechNames.filter((elem) => availableTechNames.indexOf(elem) === -1);
  }

  validate(control: AbstractControl): { [key: string]: any } {
    const diff = this.getDiffUsedAndAvailableTechName(control.value, this.availableTechNames);
    if (diff.length > 0) {
      return {
        validAvailableTechName: `${diff.join(', ')} nie występuje w formularzu`
      };
    }
    return null;
  }
}
