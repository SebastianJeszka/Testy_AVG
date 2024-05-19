import { DictionaryInterceptor } from 'cypress/interceptor/dictionary.interceptor';
import { navigateToBaseUrl } from 'cypress/utils';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { FormListPage } from '../form-list/forms-list.po';
import { CloneForm } from './clone-form.po';

describe('cloning form', () => {
  const formListPage = new FormListPage();
  const cloneFormPopup = new CloneForm();
  let originalForm = {
    id: '',
    name: ''
  };
  let clonedForm = {
    id: '',
    name: ''
  };

  before(() => {
        navigateToBaseUrl();
  });

  it('opens clone form popup', () => {
    formListPage.getMoreButtonByFormName(originalForm.name).click();
    formListPage.getCloneFormButton().contains('Klonuj').click();
    cloneFormPopup.getComponent().should('be.visible');
    cloneFormPopup.getHeader().contains('Klonuj formularz');
    cloneFormPopup.getTechNameInput().should('be.enabled');
    cloneFormPopup.getCloneButton().should('be.disabled');
  });

  it('clones existing form with new tech form name', () => {
    clonedForm.name = `klon formularza ${originalForm.name}`;
    cloneFormPopup.getTechNameInput().type(clonedForm.name);
    cloneFormPopup.getCloneButton().should('be.enabled').click();
    formListPage.waitForForms();
  });

  it('reloads forms list with new cloned form as first row in table', () => {
    formListPage.getFormListTable().should('be.visible');
    formListPage.getFirstFormName().then((firstFormName) => {
      assert(firstFormName === clonedForm.name);
    });
  });

  it('enables navigating to cloned form', () => {
    formListPage.chooseFormWithName(clonedForm.name);
    cy.url().should('include', '/generator/view/');
    cy.url().then((url) => {
      clonedForm.id = url.substring(url.lastIndexOf('/') + 1);
    });
  });
});
