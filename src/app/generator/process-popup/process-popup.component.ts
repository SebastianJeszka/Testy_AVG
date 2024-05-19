import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GraphNode, NodeProcessData } from 'src/app/_shared/models/graph-node.model';
import { AppProcess, ProcessType, RedirectProcessData } from 'src/app/_shared/models/process-of-node.model';
import { FormVersionFull, FormVersionState, FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { findAndFocusFirstIncorrectInput } from 'src/app/_shared/utils/form.utilits';
import { FormService } from 'src/app/_shared/services/form.service';
import { ProcessConfigService } from 'src/app/_shared/services/process-config.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'process-popup',
  templateUrl: './process-popup.component.html'
})
export class ProcessPopupComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(NgForm) ngForm: NgForm;
  isFormValid: boolean;
  nodeProcess: NodeProcessData = null;
  formVersion: FormVersionFull;
  formVersionState = FormVersionState;
  formVersionType: FormVersionTypes;
  subOfFormChange: Subscription;
  disableState: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProcessPopupComponent>,
    public formSevice: FormService,
    private processConfigService: ProcessConfigService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      node: GraphNode;
    }
  ) {}

  get node(): GraphNode {
    return this.data.node;
  }

  get beforeProcess(): AppProcess {
    return this.nodeProcess?.beforeProcess;
  }

  get afterProcess(): AppProcess {
    return this.nodeProcess?.afterProcess;
  }

  ngOnInit(): void {
    this.processConfigService.loadAllRespsMaps().subscribe();
    this.nodeProcess = this.data.node.data?.processes
      ? JSON.parse(JSON.stringify(this.data.node.data?.processes))
      : null;
    this.formVersion = this.formSevice.currentFormVersion;
    this.formVersionType = this.formVersion.type;
    this.disableState = !this.formSevice.checkIfEditionStateEnabledForForm();
  }

  ngAfterViewInit() {
    this.subOfFormChange = this.ngForm.form.valueChanges.subscribe((x) => {
      this.isFormValid = this.ngForm ? this.ngForm.form.valid : true;
    });
  }

  handleProcessesForCopies() {
    if (this.node.data.isCopy) return;
    const copies = this.formVersion.flow.nodes.filter(
      (node: GraphNode) => node.data.isCopy && node.id.includes(this.data.node.id)
    );
    copies.forEach((nodeCopy: GraphNode) => {
      if (this.beforeProcess.forCopies) {
        nodeCopy.data.processes.beforeProcess = this.beforeProcess;
      } else if (!this.beforeProcess.forCopies) {
        nodeCopy.data.processes.beforeProcess.forCopies = false;
      }

      if (this.afterProcess.forCopies) {
        nodeCopy.data.processes.afterProcess = this.afterProcess;
      } else if (!this.afterProcess.forCopies) {
        nodeCopy.data.processes.afterProcess.forCopies = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close({ action: 'cancel' });
  }

  onSaveChanges() {
    if (!this.isFormValid) {
      findAndFocusFirstIncorrectInput(this.ngForm);
      return;
    }
    if (
      (this.beforeProcess.enabled && !this.beforeProcess.type) ||
      (this.afterProcess.enabled && !this.afterProcess.type)
    )
      return;
    this.handleProcessesForCopies();
    this.removeExcessData(this.afterProcess);
    this.removeExcessData(this.beforeProcess);
    this.dialogRef.close({
      action: 'edit',
      nodeProcess: this.nodeProcess
    });
  }

  removeExcessData(process: AppProcess) {
    if (process.type !== ProcessType.REDIRECT) {
      process.redirectProcessData = new RedirectProcessData();
    }
    if (process.type !== ProcessType.DEFINE_EMAILS) {
      process.emailsDefineProcessData = [];
      process.emailsFieldsDefineProcessData = [];
    }
  }

  ngOnDestroy() {
    if (this.subOfFormChange) this.subOfFormChange.unsubscribe();
  }
}

export interface EditProcessData {
  action: 'edit' | 'cancel';
  nodeProcess: NodeProcessData;
}
