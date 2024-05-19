import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { FormVersionFull } from 'src/app/_shared/models/form-version.model';
import { NavigationStep, SUMMARY_STEP_ID } from 'src/app/_shared/models/stepper.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'navigation-steps',
  templateUrl: './navigation-steps.component.html',
  styleUrls: ['./navigation-steps.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class NavigationStepsComponent implements OnInit {
  @Input() formVersion: FormVersionFull;
  @Output() change: EventEmitter<void> = new EventEmitter();

  isUnique: boolean = true;
  timeoutHandlerId: number;
  summaryStepName?: string = '';

  get stepsWithoutSummaryStep() {
    return this.formVersion.navigationSteps.filter((step) => !this.isSummaryStep(step));
  }

  isSummaryStep(step: NavigationStep) {
    return step.id === SUMMARY_STEP_ID;
  }

  ngOnInit(): void {
    this.summaryStepName = this.formVersion.navigationSteps.find(this.isSummaryStep)?.name || '';
  }

  getMaxOrderIndex() {
    return this.stepsWithoutSummaryStep.reduce((a, b) => {
      return Math.max(a, b.orderIndex);
    }, 0);
  }

  addNavigationStep() {
    const maxOrderIndex = this.getMaxOrderIndex();

    this.formVersion.navigationSteps.push({
      id: this.getUuid(),
      name: '',
      orderIndex: maxOrderIndex + 1
    });

    if (this.formVersion.enableSummaryStep) {
      this.updateSummaryStepOrderIndex();
    }

    this.change.emit();
  }

  removeNavigationStep(step: NavigationStep) {
    const itemToRemoveIndex = this.formVersion.navigationSteps.findIndex((item) => item.id === step.id);
    this.formVersion.navigationSteps.splice(itemToRemoveIndex, 1);
    this.change.emit();
  }

  toggleSummaryNavigationStep() {
    if (this.formVersion.enableSummaryStep) {
      this.formVersion.navigationSteps.push({
        id: SUMMARY_STEP_ID,
        name: this.summaryStepName,
        orderIndex: this.getMaxOrderIndex() + 1
      });
    } else {
      this.formVersion.navigationSteps = this.stepsWithoutSummaryStep;
    }
    this.change.emit();
  }

  updateSummaryStepName() {
    this.formVersion.navigationSteps.find(this.isSummaryStep).name = this.summaryStepName;
  }

  updateSummaryStepOrderIndex() {
    this.formVersion.navigationSteps.find(this.isSummaryStep).orderIndex = this.getMaxOrderIndex() + 1;
  }

  navigationStepUp(step: NavigationStep) {
    this.setStepNewOrderIndex(step, step.orderIndex - 1);
  }

  navigationStepDown(step: NavigationStep) {
    this.setStepNewOrderIndex(step, step.orderIndex + 1);
  }

  stepNameIsUnique(stepNameToCheck: string) {
    const filteredSteps = this.formVersion.navigationSteps.filter(
      (step) => step.name.toLocaleLowerCase() === stepNameToCheck.toLocaleLowerCase()
    );
    const isUnique = !(filteredSteps.length > 1);

    clearTimeout(this.timeoutHandlerId);
    this.timeoutHandlerId = setTimeout(() => {
      this.isUnique = isUnique;
    });

    return isUnique;
  }

  private setStepNewOrderIndex(step: NavigationStep, newIndex: number) {
    const currentIndex = step.orderIndex;
    if (currentIndex !== newIndex) {
      const newIndexStep = this.formVersion.navigationSteps.find(
        (navigationStep) => navigationStep.orderIndex === newIndex
      );
      if (newIndexStep) {
        newIndexStep.orderIndex = currentIndex;
      }
      step.orderIndex = newIndex;
    }
  }

  private getUuid() {
    const newUuid = uuidv4();

    if (!!this.formVersion.navigationSteps.find((step) => step.id === newUuid)) {
      return this.getUuid();
    }

    return newUuid;
  }
}
