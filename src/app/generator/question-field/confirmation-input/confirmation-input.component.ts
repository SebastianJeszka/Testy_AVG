import { Component, Input } from '@angular/core';
import { QuestionField } from 'src/app/_shared/models/question-field.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';

@Component({
  selector: 'confirmation-input',
  templateUrl: './confirmation-input.component.html',
  styleUrls: ['./confirmation-input.component.scss']
})
export class ConfirmationInputComponent {
  @Input() field: QuestionField;

  types = FieldTypes;
  confirmationTestVal: string = null;
}
