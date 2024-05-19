import { NgForm } from '@angular/forms';

export function findAndFocusFirstIncorrectInput(form: NgForm): void {
  const array = Object.entries(form.controls)
    .filter(([key, control]) => control.invalid)
    .map(([key, control]) => document.querySelector(`#${key}`) || document.querySelector(`[id^="${key}"]`))
    .map((node) => node as HTMLElement)
    .filter((element) => !!element)
    .sort((input) => input.offsetHeight);
  array[0]?.focus();
  array[0]?.blur();
  array.reverse().forEach((input) => input?.focus());
}
