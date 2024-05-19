import {getFileByFileName, navigateToBaseUrl} from 'cypress/utils';
import { FormListPage } from '../../form-list/forms-list.po';
import { GeneratorPage } from '../generator-component/generator-component.po';
import { FetchResultsPopup } from './fetch-result-popup.po';

describe('popup fetch results', () => {
  const formListPage = new FormListPage();
  const generatorPage = new GeneratorPage();
  const fetchResultsPopup = new FetchResultsPopup();
  let formId: string;

  before(() => {
        navigateToBaseUrl();
  });

  describe('fetch results popup works correctly', () => {
    it('should present fetch result popup after form context menu item clicked', () => {
      fetchResultsPopup.getPopupCloseButton().should('not.exist');
      generatorPage.getFormSettingsButton().click();
      fetchResultsPopup.getFetchResultsMenuItem().click();

      fetchResultsPopup.getHeader().should('have.text', 'Pobierz wyniki');
      fetchResultsPopup.getPopupCloseButton().click();
    });
  });

  describe('fetch result popup test content', () => {
    beforeEach(() => {
      generatorPage.getFormSettingsButton().click();
      fetchResultsPopup.getFetchResultsMenuItem().click();
    });

    afterEach(() => {
      fetchResultsPopup.getPopupCloseButton().click();
    });

    it('provides min date and download file, check downloaded file has the correct name', () => {
      fetchResultsPopup.getMinDateInput().should('be.visible');
      fetchResultsPopup
        .getMinDateInput()
        .type(fetchResultsPopup.getFormattedDateNow(), { force: true })
        .should('have.value', fetchResultsPopup.getFormattedDateNow());

      fetchResultsPopup.getDownloadButton().click();
      getFileByFileName(fetchResultsPopup.getDownloadedFetchResultsFileName()).should('exist');
    });

    it('provides min and max date and download file, check downloaded file has the correct name', () => {
      fetchResultsPopup.getMinDateInput().should('be.visible');
      fetchResultsPopup
        .getMinDateInput()
        .type(fetchResultsPopup.getFormattedDateYesterday(), { force: true })
        .should('have.value', fetchResultsPopup.getFormattedDateYesterday());

      fetchResultsPopup.getMaxDateInput().clear();
      fetchResultsPopup
        .getMaxDateInput()
        .type(fetchResultsPopup.getFormattedDateNow(), { force: true })
        .should('have.value', fetchResultsPopup.getFormattedDateNow());
      fetchResultsPopup.getDownloadButton().click();
      getFileByFileName(fetchResultsPopup.getDownloadedFetchResultsFileName()).should('exist');
    });

    it('check date inputs disabled after checked "for all time" checkbox', () => {
      fetchResultsPopup.getForAllCheckbox().click();
      fetchResultsPopup.getMinDateInput().should('be.disabled');
      fetchResultsPopup.getMaxDateInput().should('be.disabled');
    });

    it('fetch data after checked "for all time" checkbox', () => {
      fetchResultsPopup.getForAllCheckbox().click();
      fetchResultsPopup.getDownloadButton().click();

      fetchResultsPopup.setFormattedResultsFetchFileName(new Date());
      getFileByFileName(fetchResultsPopup.getDownloadedFetchResultsFileName()).should('exist');
    });

    it('validation info input work correctly with minDate > maxDate', () => {
      fetchResultsPopup.getMinDateInput().should('be.visible');
      fetchResultsPopup.getMinDateInput().clear();
      fetchResultsPopup.getMinDateInput().type(fetchResultsPopup.getFormattedDateNow(), { force: true });
      fetchResultsPopup.getMaxDateInput().clear();
      fetchResultsPopup.getMaxDateInput().type(fetchResultsPopup.getFormattedDateYesterday(), { force: true });

      fetchResultsPopup.getDownloadButton().focus();
      fetchResultsPopup.getMinDateValidationErrorInfo().should('be.visible');
      fetchResultsPopup.getMaxDateValidationErrorInfo().should('be.visible');
    });

    //remove skip after fix bug / ask on daily about validation 13.12.2021
    it.skip('button validation work correctly if inputs have incorrect data ', () => {
      fetchResultsPopup.getMinDateInput().should('be.visible');
      fetchResultsPopup.getMinDateInput().type(fetchResultsPopup.getFormattedDateNow(), { force: true });
      fetchResultsPopup.getMaxDateInput().clear();
      fetchResultsPopup.getMaxDateInput().type(fetchResultsPopup.getFormattedDateYesterday(), { force: true });
      fetchResultsPopup.getDownloadButton().should('be.disabled');
    });
  });
});
