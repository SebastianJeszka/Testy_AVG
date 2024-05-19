import { Component, Inject } from '@angular/core';
import { Edge } from '@swimlane/ngx-graph';
import { OptionItem } from 'src/app/_shared/models/option.model';
import { FormVersionFull } from 'src/app/_shared/models/form-version.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'edit-link-popup',
  templateUrl: './edit-link-popup.component.html'
})
export class EditLinkPopupComponent {
  startNodeOptions: OptionItem[] = [];
  finishNodeOptions: OptionItem[] = [];
  formVersion: FormVersionFull = null;
  link: Edge = null;

  constructor(
    public dialogRef: MatDialogRef<EditLinkPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      edge: Edge;
      startNodeOptions: OptionItem[];
      finishNodeOptions: OptionItem[];
      formVersion: FormVersionFull;
    }
  ) {
    this.link = this.data.edge;
    this.startNodeOptions = this.data.startNodeOptions;
    this.finishNodeOptions = this.data.finishNodeOptions;
    this.formVersion = this.data.formVersion;
  }

  cancel(original) {
    this.dialogRef.close({ action: 'cancel' });
  }

  onRemove() {
    const result = {
      action: 'remove',
      link: this.link
    };
    this.dialogRef.close(result);
  }

  onAddNewLink(link) {
    const result: EditLinkResult = {
      action: 'edit',
      link
    };
    this.dialogRef.close(result);
  }
}

export interface EditLinkResult {
  action: 'edit' | 'remove' | 'cancel';
  link: Edge;
}
