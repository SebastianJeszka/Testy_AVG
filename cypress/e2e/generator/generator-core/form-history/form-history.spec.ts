import {
  closeSimpleSnackBar,
  getSimpleSnackBarWithText,
  navigateToBaseUrl,
  rejectOperation,
} from 'cypress/utils';
import { FormListPage } from '../../form-list/forms-list.po';
import { GeneratorPage } from '../generator-component/generator-component.po';
import { FormHistory } from './form-history.po';

describe('form history (form versioning)', () => {
  const formListPage = new FormListPage();
  const generatorPage = new GeneratorPage();
  const formHistory = new FormHistory();
  let formId: string;

  before(() => {
        navigateToBaseUrl();
  });

  it('presents new version in SKETCH state after expanding form history component', () => {
    formHistory.getToggleButton().should('not.have.attr', 'open');

    formHistory.expandFormHistory();

    formHistory.getToggleButton().should('have.attr', 'open');
    formHistory.getLatestFormVersionState().should('have.text', 'Szkic');
  });

  it('presents "Gotowy do publikacji" button in SKETCH state', () => {
    generatorPage.getChangeStatusToPendingButton().should('be.visible');
    generatorPage.getNewSketchButton().should('not.exist');
  });

  it('can delete form version in SKETCH state', () => {
    formHistory.getFormVersionSettingsContextMenu().click();

    formHistory.getRemoveFormVersionOption().should('be.enabled');

    formHistory.getRemoveFormVersionOption().click();
    rejectOperation();
  });

  it('deletes form with one form version in SKETCH state', () => {
    formHistory.deleteFormVersion();
    cy.wait(1000);

    getSimpleSnackBarWithText('Ostatnia wersja formularza została usunięta. Cały formularz został usunięty').should(
      'be.visible'
    );

    closeSimpleSnackBar();
  });

  it('returns to form list after form deleted', () => {
    cy.url().should('include', '/generator');
  });

  it('should not present deleted form in form list', () => {
    formListPage.getFormWithName(generatorPage.formTechName).should('not.exist');
  });
});
