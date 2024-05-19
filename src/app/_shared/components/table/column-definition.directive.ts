import { Directive, TemplateRef, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
  selector: '[mcColumnDef]'
})
export class ColumnDefinitionDirective {
  private _columnName: string;

  @Input('mcColumnDef')
  get columnName() {
    if (this._columnName) {
      return this._columnName;
    }

    // if (!environment.production) {
    //   console.warn('Value into directive mcColumnDef is required to hideColumn.');
    // }

    return '';
  }
  set columnName(val: string) {
    this._columnName = val;
  }

  constructor(public template: TemplateRef<any>) {}
}
