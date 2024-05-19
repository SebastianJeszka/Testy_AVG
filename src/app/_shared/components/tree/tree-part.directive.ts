import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[treePart]'
})
export class TreePartDirective {
  @Input('treePart')
  role: string;

  constructor(public template: TemplateRef<any>) {}
}
