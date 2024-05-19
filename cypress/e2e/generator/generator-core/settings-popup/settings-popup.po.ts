import { getOptionByIndex, getItemByTestId } from 'cypress/utils';
import { ReportScopeType } from '../../../../../src/app/_shared/models/sending-results.model';

export class SettingsPopup {
  getSettingsMenuItem() {
    return getItemByTestId('settingsMenuItem');
  }

  getPreviewMenuItem() {
    return getItemByTestId('previewMenuItem');
  }

  getHeader() {
    return getItemByTestId('settingsHeader');
  }

  getComponent() {
    return cy.get('settings-popup');
  }

  getTabs() {
    return this.getComponent().find('.mat-tab-labels').find('div[role=tab]');
  }

  getCaptchaCheckbox() {
    return cy.get('label[for=captchaEnabled]');
  }

  getSummarySectionCheckbox() {
    return cy.get('label[for=summarySectionEnabled]');
  }

  getSaveGeneralSettingsButton() {
    return getItemByTestId('saveGeneralSettings');
  }

  getSendingResultsHeader() {
    return getItemByTestId('sendingResultsHeader');
  }

  getSendingResultsDisabledInfo() {
    return getItemByTestId('sendingResultsDisabledInfo');
  }

  getFrequencyTypeSelect() {
    return cy.get('#frequencyType');
  }

  getEnableSendingResultsButton() {
    return getItemByTestId('enableSendingResultsButton');
  }

  getDisableSendingResultsButton() {
    return getItemByTestId('disableSendingResultsButton');
  }

  getRemoveBackgroundButton() {
    return getItemByTestId('removeBackgroundButton');
  }

  getBackgroundPreviewLabel() {
    return getItemByTestId('backgroundPreviewLabel');
  }

  getImageCropper() {
    return this.getComponent().find('image-cropper');
  }

  getChooseFileButton() {
    return this.getComponent().find('input[type="file"]');
  }

  getAccessFormConfigCheckbox() {
    return getItemByTestId('accessFormConfigEnabled');
  }

  getAccessFormListSelect() {
    return getItemByTestId('accessFormListSelect').find('mat-select');
  }

  getAccessFormSaveButton() {
    return getItemByTestId('accessFormSettingsSave');
  }

  getRegisteredUsersListComponent() {
    return cy.get('registered-users-list');
  }

  setSendingTime(hourStepClicked: number, minuteStepClicked: number) {
    for (let clicked = 0; clicked < hourStepClicked; clicked++) {
      cy.get('.ngb-tp-hour > button').eq(0).click();
    }
    for (let clicked = 0; clicked < minuteStepClicked; clicked++) {
      cy.get('.ngb-tp-minute > button').eq(0).click();
    }
  }

  chooseFrequencyType(optionIndex: number) {
    this.getFrequencyTypeSelect().click();
    getOptionByIndex(optionIndex).click();
  }

  chooseReportType(reportType: string) {
    cy.get(`label[for=scopeTypes${reportType}`).click();
  }

  enableSendingResults() {
    this.chooseFrequencyType(0);
    this.setSendingTime(3, 5);
    this.chooseReportType(ReportScopeType.DIFFERENTIAL);
    this.getEnableSendingResultsButton().click();
  }

  uploadSampleBackground() {
    this.getChooseFileButton().attachFile('background.jpg');
  }
}
