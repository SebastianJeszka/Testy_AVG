import { Component, Input, OnChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { AppProcess, PreviewGeneratorType } from 'src/app/_shared/models/process-of-node.model';

@Component({
  selector: 'preview-generator-process',
  templateUrl: './preview-generator.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class PreviewGeneratorComponent implements OnChanges {
  @Input() process: AppProcess = null;
  @Input() processExecuteTime: 'before' | 'after' = null;
  @Input() disableState: boolean = false;

  previewGeneratorType = PreviewGeneratorType;

  ngOnChanges() {
    if (this.process && !this.process.previewGeneratorType) {
      this.process.previewGeneratorType = PreviewGeneratorType.STANDARD;
    }
  }
}
