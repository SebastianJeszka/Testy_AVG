import { generateFormNameWithDate } from 'cypress/utils';
import { DefaultTabLabels, TabType } from 'src/app/_shared/models/tab.model';
import { FormVersionState, FormVersionTestConfig, FormVersionTypes, RegistrationConfirmationType, RegistrationConfirmationTypeLabels } from 'src/app/_shared/models/form-version.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';

export const baseTestTextField = {
  title: 'Etykieta pola TEXT_FIELD',
  techName: 'etykieta_pola_text_field'
};

export const getFormVersionMock = (configToOverride?: FormVersionTestConfig) => {
  let preparedFormVersionMock = formVerionsMock;
  preparedFormVersionMock.name = generateFormNameWithDate() + ' from mock';
  if (configToOverride) {
    Object.keys(configToOverride).forEach((key: string) => {
      preparedFormVersionMock[key] = configToOverride[key];
    });
  }
  return preparedFormVersionMock;
};

const formVerionsMock = {
  allFieldTechNames: [],
  description: null,
  formId: null,
  id: null,
  name: '',
  state: FormVersionState.SKETCH,
  type: FormVersionTypes.FORM,
  enableNavigation: false,
  enableSummaryStep: false,
  registrationConfirmationType: RegistrationConfirmationType.VIA_EMAIL,
  flow: {
    nodes: [
      {
        id: null,
        label: DefaultTabLabels[TabType.MAIN],
        data: {
          processes: {
            beforeProcess: {
              enabled: false,
              type: null,
              forCopies: null,
              redirectProcessData: {
                urlForRedirect: null
              },
              emailsDefineProcessData: [],
              emailsDefineMessageTypeResults: true,
              emailsDefineMessageTypePersonal: false,
              emailsDefineMessage: '',
              emailsFieldsDefineProcessData: [],
              emailsFieldsDefineMessageTypeResults: true,
              emailsFieldsDefineMessageTypePersonal: false,
              emailsFieldsDefineMessage: '',
              autocompleteMap: []
            },
            afterProcess: {
              enabled: false,
              type: null,
              forCopies: null,
              redirectProcessData: {
                urlForRedirect: null
              },
              emailsDefineProcessData: [],
              emailsDefineMessageTypeResults: true,
              emailsDefineMessageTypePersonal: false,
              emailsDefineMessage: '',
              emailsFieldsDefineProcessData: [],
              emailsFieldsDefineMessageTypeResults: true,
              emailsFieldsDefineMessageTypePersonal: false,
              emailsFieldsDefineMessage: '',
              autocompleteMap: []
            }
          },
          isCopy: false
        },
        hiddenFields: []
      },
      {
        id: null,
        label: DefaultTabLabels[TabType.FINISH],
        data: {
          processes: {
            beforeProcess: {
              enabled: false,
              type: null,
              forCopies: null,
              redirectProcessData: {
                urlForRedirect: null
              },
              emailsDefineProcessData: [],
              emailsDefineMessageTypeResults: true,
              emailsDefineMessageTypePersonal: false,
              emailsDefineMessage: '',
              emailsFieldsDefineProcessData: [],
              emailsFieldsDefineMessageTypeResults: true,
              emailsFieldsDefineMessageTypePersonal: false,
              emailsFieldsDefineMessage: '',
              autocompleteMap: []
            },
            afterProcess: {
              enabled: false,
              type: null,
              forCopies: null,
              redirectProcessData: {
                urlForRedirect: null
              },
              emailsDefineProcessData: [],
              emailsDefineMessageTypeResults: true,
              emailsDefineMessageTypePersonal: false,
              emailsDefineMessage: '',
              emailsFieldsDefineProcessData: [],
              emailsFieldsDefineMessageTypeResults: true,
              emailsFieldsDefineMessageTypePersonal: false,
              emailsFieldsDefineMessage: '',
              autocompleteMap: []
            }
          },
          isCopy: false
        },
        hiddenFields: []
      }
    ],
    links: []
  },
  tabs: [
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
            type: FieldTypes.TEXT_FIELD
          },
          hasContent: true,
          minItemRows: 1
        }
      ],
      navigationStepId: null,
      orderIndex: 0
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
      orderIndex: 1
    }
  ],
  navigationSteps: []
};
