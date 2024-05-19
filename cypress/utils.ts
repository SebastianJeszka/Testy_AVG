import * as path from 'path';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { FormVersionFull, FormVersionTestConfig } from 'src/app/_shared/models/form-version.model';
import { getFormVersionMock } from './fixtures/form-version.mock';

const backendUrl = 'https://ec2-52-59-247-105.eu-central-1.compute.amazonaws.com:8443';

const getSimpleSnackBar = () => {
  return cy.get('simple-snack-bar');
};

const getSimpleSnackBarWithText = (snackBarText: string) => {
  return getSimpleSnackBar().find('> span').contains(snackBarText);
};

const closeSimpleSnackBar = () => {
  getSimpleSnackBar().find('.mat-button-wrapper').click();
  getSimpleSnackBar().find('.mat-button-wrapper').should('not.exist');
};

const getOptionByIndex = (optionIndex: number) => {
  return cy.get('.mat-option').eq(optionIndex);
};

const getOptionByLabel = (label: string) => {
  return cy.get('.mat-option').contains(label);
};

const getSelectScrollableContainer = () => {
  return cy.get('.mat-select-panel');
};

const generateFormNameWithDate = (formName = 'testy automatyczne generatora') =>
  `${formName} ${new Date().toLocaleString()}`;

const getItemByTestId = (item: string) => cy.get(`[data-testid=${item}]`);

const closePopup = () => cy.get('.close-popup-btn').click();

const confirmOperation = () => cy.get('.confirm-btn-container > button.btn-primary').click();

const rejectOperation = () => cy.get('.confirm-btn-container > button.btn-secondary').click();

const waitForDialogClosed = () => cy.get('mat-dialog-container').should('not.exist');

const getWysiwygSelector = (): string => 'iframe.cke_wysiwyg_frame';

const typeToWysiwyg = (text: string) => {
  cy.wait(1000);
  cy.get(getWysiwygSelector()).then(($iframe) => {
    cy.wrap($iframe.contents().find('body').first()).clear().type(text);
  });
};

const convertToDate = (dateString: string) => {
  const date = dateString.trim().split(' ')[0];
  const time = dateString.trim().split(' ')[1];
  const dateSplitted = date.split('.').map((text: string) => +text);
  const timeSplitted = time.split(':').map((text: string) => +text);
  return new Date(dateSplitted[2], dateSplitted[1], dateSplitted[0], timeSplitted[0], timeSplitted[1]);
};

const convertDateFormat = (date) => {
  const [day, month, year] = date.split('/');
  return [year, month, day].join('-');
};

const getFileByFileName = (fileName: string) => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  return cy.readFile(path.join(downloadsFolder, fileName));
};

const isTypeWithOptions = (type: FieldTypes) =>
  type === FieldTypes.CHECKBOX || type === FieldTypes.SELECT || type === FieldTypes.RADIO;

// const setTokenToStorage = (token) => {
//   // return window.localStorage.setItem('generator-form-jwt-token', token);
//   return localStorage.setItem('generator-form-jwt-token', token); // FIXME if this not works in some cases
// };

// const getTokenFromStorage = () => {
//   // return window.localStorage.getItem('generator-form-jwt-token');
//   return localStorage.getItem('generator-form-jwt-token');
// };

// const loginByApi = () => {
//   return cy
//     .request({
//       method: 'GET',
//       // TODO move domain to some env config
//       url: backendUrl + '/app/form-generator-back/api/forms',
//       body: {
//         login: Cypress.env('USER_LOGIN'),
//         password: Cypress.env('USER_PASSWORD'),
//       }
//     })
//     .then((resp) => {
//       setTokenToStorage(resp.body?.token);
//       Cypress.env('token', resp.body?.token);
//     });
// };

// const createFormByApi = (formConfigOverride?: FormVersionTestConfig) => {
//   return cy.request<FormVersionFull>({
//     method: 'POST',
//     url: backendUrl + '/app/form-generator-back/api/forms',
//     headers: {
//       Authorization: `Bearer ${Cypress.env('token')}` || ''
//     },
//     body: getFormVersionMock(formConfigOverride)
//   });
// };

// const removeFormByApi = (formId: string) => {
//   if (!formId) {
//     console.log('Form Id didn`t assign');
//     return;
//   }
//   return cy.request({
//     method: 'POST',
//     url: `${backendUrl}/app/form-generator-back/api/forms/delete?formId=${formId}`,
//     headers: {
//       Authorization: `Bearer ${Cypress.env('token')}` || ''
//     }
//   });
// };

// const createInitialAppState = (formConfig?: FormVersionTestConfig) => {
//   return loginByApi().then(() => createFormByApi(formConfig));
// };

const navigateToBaseUrl = () => {
  cy.visit('/');
};

const goToTabsFlowComponent = () => {
  getItemByTestId('tabsFlowComponentLink').click({ force: true })
};

const chooseFormWithName = (formName: string) => {
  if (formName) {
    getItemByTestId('formsListLink').filter(`:contains(${formName})`).click();
  }
};

export {
  closePopup,
  closeSimpleSnackBar,
  confirmOperation,
  generateFormNameWithDate,
  getItemByTestId,
  getOptionByIndex,
  getOptionByLabel,
  getSimpleSnackBar,
  getSimpleSnackBarWithText,
  rejectOperation,
  typeToWysiwyg,
  waitForDialogClosed,
  convertToDate,
  convertDateFormat,
  getFileByFileName,
  isTypeWithOptions,
  // createFormByApi,
  // removeFormByApi,
  // getTokenFromStorage,
  // setTokenToStorage,
  // loginByApi,
  // createInitialAppState,
  navigateToBaseUrl,
  getSelectScrollableContainer,
  chooseFormWithName,
  goToTabsFlowComponent
};
