import { DictionaryInterceptor } from 'cypress/interceptor/dictionary.interceptor';
import { getItemByTestId } from 'cypress/utils';

export class DictionaryView {
  getComponent() {
    return cy.get('dictionary-view');
  }

  getDictionaryEditSaveButton() {
    return getItemByTestId('saveEditDictionaryButton');
  }

  getDictionaryEditDescriptionTextarea() {
    return getItemByTestId('editDictionaryDescriptionTextarea');
  }

  getDictionaryEditInput() {
    return getItemByTestId('editDictionaryNameInput').find('input#dictionaryName');
  }

  getDictionaryEditButton() {
    return getItemByTestId('editDictionaryButton');
  }

  getDictionaryName() {
    return getItemByTestId('dictionaryName');
  }

  getDictionaryDescription() {
    return getItemByTestId('dictionaryDescription');
  }

  getRemoveDictionaryButton() {
    return getItemByTestId('removeDictionaryButton');
  }

  waitForDictionaries() {
    const listenerId = DictionaryInterceptor.getNewList();
    cy.wait(listenerId);
  }
}
