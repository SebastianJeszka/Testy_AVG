import { AdditionalValidators } from 'src/app/_shared/models/additional-validators.enum';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { DefaultTabLabels, TabType } from 'src/app/_shared/models/tab.model';

export const tabsWithEmailField = [
  {
    title: DefaultTabLabels[TabType.MAIN],
    type: TabType.MAIN,
    id: null,
    questions: [
      {
        cols: 3,
        rows: 1,
        y: 0,
        x: 0,
        field: {
          id: null,
          title: 'Etykieta pola TEXT_FIELD',
          techName: 'etykieta_pola_text_field',
          readOnly: false,
          placeholder: '',
          description: '',
          options: [],
          returnOnlySelectedOptions: false,
          dictionaryName: null,
          searchEnabled: null,
          showRequiredFieldsInfo: null,
          validation: {
            required: true,
            maxLength: 255,
            minLength: null,
            maxValue: null,
            minValue: null,
            additionalValidator: AdditionalValidators.EMAIL,
            minDate: null,
            maxDate: null,
            dateFromNow: null,
            dateUntilNow: null,
            pattern: null,
            maxFilesNumber: null,
            maxFileSize: null,
            fileFormats: null,
            verifySignature: false
          },
          type: FieldTypes.TEXT_FIELD
        },
        hasContent: true,
        minItemRows: 1
      }
    ],
    navigationStepId: null,
    orderIndex: 0,
    showInSummary: true
  },
  {
    title: DefaultTabLabels[TabType.FINISH],
    type: TabType.FINISH,
    id: null,
    questions: [
      {
        cols: 3,
        rows: 1,
        y: 0,
        x: 0,
        field: {
          id: null,
          title: 'Etykieta pola TEXTAREA',
          techName: 'etykieta_pola_textarea',
          readOnly: false,
          placeholder: '',
          description: '',
          options: [],
          returnOnlySelectedOptions: false,
          dictionaryName: null,
          searchEnabled: null,
          showRequiredFieldsInfo: null,
          validation: {
            required: true,
            maxLength: null,
            minLength: null,
            maxValue: null,
            minValue: null,
            additionalValidator: null,
            minDate: null,
            maxDate: null,
            dateFromNow: null,
            dateUntilNow: null,
            pattern: null,
            maxFilesNumber: null,
            maxFileSize: null,
            fileFormats: null,
            verifySignature: false
          },
          type: FieldTypes.TEXTAREA
        },
        hasContent: true,
        minItemRows: 1
      }
    ],
    navigationStepId: null,
    orderIndex: 1,
    showInSummary: true
  }
];
