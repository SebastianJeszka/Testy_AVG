import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormVersionFull } from 'src/app/_shared/models/form-version.model';
import { FormService } from 'src/app/_shared/services/form.service';
import * as jsonata from 'jsonata';
import { AppGridsterItem, Tab } from 'src/app/_shared/models/tab.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { getRandomNumber } from 'src/app/_shared/utils/random-number.utilits';
import { SimpleAnswer } from 'src/app/_shared/models/question-field.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const REPEATING_SECTION_KEY_NAME = '$repeatingSectionIndex';

@Component({
  selector: 'field-state-query',
  templateUrl: './field-state-query.component.html',
  styleUrls: ['./field-state-query.component.scss']
})
export class FieldStateQueryComponent implements OnInit {
  formVersionCopy: FormVersionFull;
  result: string;
  stateOfQueryEvaluation: 'success' | 'error' | 'notFound' = null;
  queryInputTimeout: ReturnType<typeof setTimeout> = null;
  editorOptions = {
    theme: 'vs-light',
    language: 'javascript'
  };
  repeatingSectionIndexKeyName = REPEATING_SECTION_KEY_NAME;
  isMonacoEditorLoading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<FieldStateQueryComponent>,
    @Inject(MAT_DIALOG_DATA) public query: string,
    private formService: FormService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.prepareFormJson();
    if (this.query) this.onChangeQuery();
  }

  prepareFormJson(): void {
    this.formVersionCopy = JSON.parse(JSON.stringify(this.formService.currentFormVersion));
    this.setupRandomValues();
  }

  setupRandomValues() {
    this.formVersionCopy.tabs.forEach((tab: Tab) => {
      tab.questions.forEach((gridItem: AppGridsterItem) => {
        if (gridItem.field.type === FieldTypes.REPEATING_SECTION) {
          this.createAnswerForRepeatingSection(gridItem);
        } else {
          this.createAnswersForSimpleFields(gridItem);
        }
      });
    });
  }

  createAnswersForSimpleFields(gridItem: AppGridsterItem): void {
    if (gridItem.field.type === FieldTypes.SELECT || gridItem.field.type === FieldTypes.CHECKBOX) {
      gridItem.field['__userAnswer'] = [getRandomNumber().toString()];
    } else {
      (gridItem.field['__userAnswer'] as any) = getRandomNumber().toString();
    }
  }

  createAnswerForRepeatingSection(gridItem: AppGridsterItem): void {
    if (gridItem.field.type === FieldTypes.REPEATING_SECTION) {
      const numberOfSections = 2;
      const answersArray = [];

      for (let i = 0; i < numberOfSections; i++) {
        answersArray.push(this.craeteOneSectionAnswer(gridItem));
      }

      gridItem.field['__userAnswer'] = answersArray;
    }
  }

  craeteOneSectionAnswer(gridItem: AppGridsterItem): SimpleAnswer[] {
    return gridItem.field.repeatingSectionGrid.map((sectionItem: AppGridsterItem) => {
      const answer: SimpleAnswer = new SimpleAnswer();
      answer.answers = [getRandomNumber().toString()];
      answer.questionFieldId = sectionItem.field.id;
      answer.visited = true;
      return answer;
    });
  }

  onKeyUpQueryInput(): void {
    if (this.queryInputTimeout) {
      clearTimeout(this.queryInputTimeout);
    }
    this.queryInputTimeout = setTimeout(() => this.onChangeQuery(), 500);
  }

  onChangeQuery(): void {
    let expression: any;
    try {
      expression = jsonata(this.query);
    } catch (err) {
      if (err?.message) {
        this.result = err.message;
      }
      this.stateOfQueryEvaluation = 'error';
      return;
    }

    expression.evaluate(this.formVersionCopy, {}, (err: jsonata.JsonataError, result: any) => {
      if (err) {
        console.error(err);
        this.result = err.message;
        return;
      }
      this.handleQueryResult(result);
    });
  }

  handleQueryResult(result: any): void {
    const wrongResultMessage = '** nic nie znaleziono **';
    if (result === undefined) {
      this.stateOfQueryEvaluation = 'notFound';
      this.result = wrongResultMessage;
      return;
    }

    if (typeof result === 'boolean') {
      result = result.toString();
    }
    this.result = result;
    this.stateOfQueryEvaluation = 'success';
  }

  onMonacoEditorLoaded(e) {
    this.isMonacoEditorLoading = false;
    this.ref.detectChanges();
  }

  onCloseQueryEdition(): void {
    this.dialogRef.close();
  }

  onSaveQueryEdition(): void {
    this.dialogRef.close(this.query);
  }
}
