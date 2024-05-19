import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, Validators } from '@angular/forms';
import { FieldTypes } from '../models/field-types.enum';
import { GraphNode } from '../models/graph-node.model';
import { AppProcess } from '../models/process-of-node.model';
import { AppGridsterItem, Tab } from '../models/tab.model';
import { FormService } from '../services/form.service';

const ENIQUE_TECH_NAME_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UniqueTechNameDirective),
  multi: true
};

@Directive({
  selector: '[uniqueTechName]',
  providers: [ENIQUE_TECH_NAME_VALIDATOR]
})
export class UniqueTechNameDirective implements Validator {
  @Input('uniqueTechName') fieldId: string = null;

  constructor(private formService: FormService) {}

  validate(control: AbstractControl): { [key: string]: any } {
    if (Validators.required(control)) {
      return null;
    }
    if (!this.techNameIsUnique(control.value)) {
      return { techName: true };
    }
    return null;
  }

  techNameIsUnique(techNameToCheck: string) {
    let techNameIsUnique = true;

    const checkIfQuestionHaveThisTechName = (question: AppGridsterItem) => {
      if (question.field.techName && techNameToCheck) {
        return (
          question.field.techName === techNameToCheck &&
          (question.field.id || this.fieldId) &&
          question.field.id !== this.fieldId
        );
      }
    };

    const checkIfProcessHaveThisTechName = (process: AppProcess) => {
      if (process.techName && techNameToCheck) {
        return process.techName === techNameToCheck && this.fieldId !== process.type;
      }
    };

    const currentFormVersion = this.formService.currentFormVersion;

    currentFormVersion.tabs.forEach((tab: Tab) => {
      const ifExistSameTechName = tab.questions.some((question: AppGridsterItem) => {
        if (question.field.type !== FieldTypes.REPEATING_SECTION && checkIfQuestionHaveThisTechName(question)) {
          return true;
        } else if (question.field.type === FieldTypes.REPEATING_SECTION) {
          if (checkIfQuestionHaveThisTechName(question)) return true;
          return question.field.repeatingSectionGrid.some((question: AppGridsterItem) =>
            checkIfQuestionHaveThisTechName(question)
          );
        }
      });
      if (ifExistSameTechName) {
        techNameIsUnique = false;
      }
    });

    const nodes = currentFormVersion.flow?.nodes;
    if (nodes) {
      nodes.forEach((node: GraphNode) => {
        if (
          checkIfProcessHaveThisTechName(node.data.processes.beforeProcess) ||
          checkIfProcessHaveThisTechName(node.data.processes.afterProcess)
        ) {
          techNameIsUnique = false;
        }
      });
    }

    return techNameIsUnique;
  }
}
