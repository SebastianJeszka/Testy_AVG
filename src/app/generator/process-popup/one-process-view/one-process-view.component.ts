import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { combineLatest, from, Observable, Subscription, withLatestFrom } from 'rxjs';
import { NgxIbeRolesService } from '@ngx-ibe/core/roles';
import { FormVersionFull, FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { GraphNode } from 'src/app/_shared/models/graph-node.model';
import { OptionItem } from 'src/app/_shared/models/option.model';
import {
  AppProcess,
  ProcessType,
  ProcessTypeOptions,
  ProcessDataType
} from 'src/app/_shared/models/process-of-node.model';

@Component({
  selector: 'one-process-view',
  templateUrl: './one-process-view.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class OneProcessViewComponent implements OnInit, OnDestroy {
  @Input() processExecuteTime: 'before' | 'after' = null;
  @Input() process: AppProcess = null;
  @Input() disableState: boolean = false;
  @Input() node: GraphNode = null;
  @Input() formVersionType: FormVersionTypes;
  @Input() formVersion: FormVersionFull;
  ProcessDataType = ProcessDataType;
  processTypesOptions: OptionItem[] = [];
  processTypesLabels = ProcessType;
  disableChangesForCopy: boolean = false;
  private subscription: Subscription;

  constructor(private rolesService: NgxIbeRolesService) {}

  ngOnInit() {
    this.processTypesOptions = this.processTypesOptions.filter(
      (oItem: OptionItem) => oItem.id !== ProcessType.SIGNING_DOC
    );

    this.disableChangesForCopy = this.process.forCopies && this.node.data.isCopy;
    this.getProcessTypesOptions();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onChangeProcessEnabling() {
    if (!this.process.enabled) {
      this.process = new AppProcess();
    }
  }

  private getProcessTypesOptions() {
    const sources: Observable<boolean>[] = [];

    ProcessTypeOptions.forEach((option) => sources.push(this.rolesService.exceptRole(`DENY_PROCESS_${option.id}`)));

    this.subscription = combineLatest([...sources]).subscribe((data) => {
      this.processTypesOptions = ProcessTypeOptions.filter((item, index) => data[index]);
    });
  }
}
