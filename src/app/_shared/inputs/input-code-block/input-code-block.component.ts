import {
  Component,
  Optional,
  Inject,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { MonacoEditorOptions } from '../../models/monaco-editor-options.model';

import { ElementBase } from '../element-base';

@Component({
  selector: 'mc-input-code-block',
  templateUrl: './input-code-block.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CodeBlockInputComponent,
      multi: true
    }
  ],
  styleUrls: ['./input-code-block.component.scss']
})
export class CodeBlockInputComponent extends ElementBase<string> implements AfterViewInit {
  @Input() public label: string = '';
  @Input() public name: string = '';
  @Input() public disabled: boolean = false;
  @Input() autoFocus: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() dataTestIdValue: string = 'codeBlockEditorField';
  @Input()
  set errorMessages(obj: { [key: string]: string }) {
    this.customErrorMessages = obj;
  }
  @Input() public editorOptions: MonacoEditorOptions = new MonacoEditorOptions();

  @ViewChild(NgModel) model: NgModel;
  @ViewChild('ngx-monaco-editor') input: ElementRef;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    private ref: ChangeDetectorRef
  ) {
    super(validators, asyncValidators);
  }

  ngAfterViewInit(): void {
    if (this.readOnly) {
      this.editorOptions = { ...this.editorOptions, readOnly: this.readOnly };
    }
    if (this.autoFocus && this.input) {
      this.ref.detectChanges();
      setTimeout(() => this.input.nativeElement.focus());
    }
  }

  onMonacoEditorLoaded(e) {
    this.ref.detectChanges();
  }
}
