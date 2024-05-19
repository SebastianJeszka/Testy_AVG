import { AuthPage } from 'cypress/e2e/auth/auth.po';
import {
  closePopup,
  closeSimpleSnackBar,
  getSimpleSnackBarWithText,
  navigateToBaseUrl,
} from 'cypress/utils';
import { ReportScopeType } from '../../../../../src/app/_shared/models/sending-results.model';
import { FormListPage } from '../../form-list/forms-list.po';
import { GeneratorPage } from '../generator-component/generator-component.po';
import { SettingsPopup } from './settings-popup.po';

describe('settings popup', () => {
  const authPage = new AuthPage();
  const formListPage = new FormListPage();
  const generatorPage = new GeneratorPage();
  const settingsPopup = new SettingsPopup();
  let formId: string;

  before(() => {
        navigateToBaseUrl();
  });

  it('presents settings popup after form context menu item clicked', () => {
    generatorPage.getFormSettingsButton().click();
    settingsPopup.getSettingsMenuItem().click();

    settingsPopup.getHeader().should('have.text', 'Ustawienia');
  });

  it('has three settings tabs by default', () => {
    settingsPopup.getTabs().should('have.length', 3);
  });

  it('changes general settings (captcha, summary section)', () => {
    settingsPopup.getCaptchaCheckbox().click();
    settingsPopup.getSummarySectionCheckbox().click();
    settingsPopup.getSaveGeneralSettingsButton().click();

    getSimpleSnackBarWithText('Zmiany zostały zastosowane').should('exist');
    closeSimpleSnackBar();
  });

  it('switches to second tab with sending results initially disabled', () => {
    settingsPopup.getTabs().eq(0).should('have.attr', 'aria-selected', 'true');
    settingsPopup.getTabs().eq(1).should('have.attr', 'aria-selected', 'false');
    settingsPopup.getTabs().eq(2).should('have.attr', 'aria-selected', 'false');

    settingsPopup.getTabs().eq(1).click();

    settingsPopup.getTabs().eq(0).should('have.attr', 'aria-selected', 'false');
    settingsPopup.getTabs().eq(1).should('have.attr', 'aria-selected', 'true');
    settingsPopup.getTabs().eq(2).should('have.attr', 'aria-selected', 'false');

    settingsPopup
      .getSendingResultsHeader()
      .should('have.text', 'Konfiguracja cyklicznego wysyłania wyników formularzy');
    settingsPopup.getSendingResultsDisabledInfo().should('contain.text', 'Cykliczne wysyłanie wyników WYŁĄCZONO');
    settingsPopup.getEnableSendingResultsButton().should('contain.text', 'Włącz wysyłanie');
  });

  it('enables sending results', () => {
    settingsPopup.enableSendingResults();

    settingsPopup.getEnableSendingResultsButton().should('contain.text', 'Zmień ustawienia');
    settingsPopup.getDisableSendingResultsButton().should('contain.text', 'Wyłącz wysyłanie');
  });

  it('changes sending results frequency type report scope type', () => {
    settingsPopup.chooseFrequencyType(3);
    settingsPopup.chooseReportType(ReportScopeType.ALL_DATA);
    settingsPopup.getEnableSendingResultsButton().click();
  });

  it('disables sending results', () => {
    settingsPopup.getSendingResultsDisabledInfo().should('not.exist');

    settingsPopup.getDisableSendingResultsButton().click();

    settingsPopup.getSendingResultsDisabledInfo().should('contain.text', 'Cykliczne wysyłanie wyników WYŁĄCZONO');
    settingsPopup.getEnableSendingResultsButton().should('contain.text', 'Włącz wysyłanie');

    settingsPopup.getDisableSendingResultsButton().should('not.exist');
  });

  it('switches to first tab', () => {
    settingsPopup.getTabs().eq(0).should('have.attr', 'aria-selected', 'false');
    settingsPopup.getTabs().eq(0).click();
    settingsPopup.getTabs().eq(0).should('have.attr', 'aria-selected', 'true');
  });

  it('uploads background', () => {
    settingsPopup.getBackgroundPreviewLabel().should('not.exist');
    settingsPopup.getRemoveBackgroundButton().should('not.exist');
    settingsPopup.getImageCropper().should('not.exist');

    settingsPopup.uploadSampleBackground();

    settingsPopup.getBackgroundPreviewLabel().should('contain.text', 'Podgląd tła:');
    settingsPopup.getRemoveBackgroundButton().should('exist');
    settingsPopup.getImageCropper().should('exist');

    settingsPopup.getSaveGeneralSettingsButton().click();
    closePopup();
    closeSimpleSnackBar();
  });

  it('has background visible on edited form', () => {
    settingsPopup.getComponent().should('not.exist');
    generatorPage.getForm().should('not.have.css', 'background-image', 'none');
  });

  it('removes background', () => {
    generatorPage.getFormSettingsButton().click();
    settingsPopup.getSettingsMenuItem().click();
    settingsPopup.getRemoveBackgroundButton().click();

    settingsPopup.getBackgroundPreviewLabel().should('not.exist');
    settingsPopup.getRemoveBackgroundButton().should('not.exist');
    settingsPopup.getImageCropper().should('not.exist');

    settingsPopup.getSaveGeneralSettingsButton().click();
    closePopup();
    closeSimpleSnackBar();

    settingsPopup.getComponent().should('not.exist');
    generatorPage.getForm().should('have.css', 'background-image', 'none');
  });
});
