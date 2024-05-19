import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[queryField]' })
export class QueryFieldDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[queryArrowIcon]' })
export class QueryArrowIconDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[queryButtonGroup]' })
export class QueryButtonGroupDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[queryRemoveButton]' })
export class QueryRemoveButtonDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[queryEmptyWarning]' })
export class QueryEmptyWarningDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[queryEntity]' })
export class QueryEntityDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[queryInput]' })
export class QueryInputDirective {
  /** Unique name for query input type. */
  @Input()
  get queryInputType(): string {
    return this._type;
  }
  set queryInputType(value: string) {
    // If the directive is set without a type (updated programatically), then this setter will
    // trigger with an empty string and should not overwrite the programatically set value.
    if (!value) {
      return;
    }
    this._type = value;
  }
  private _type: string;

  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[queryOperator]' })
export class QueryOperatorDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({ selector: '[querySwitchGroup]' })
export class QuerySwitchGroupDirective {
  constructor(public template: TemplateRef<any>) {}
}
