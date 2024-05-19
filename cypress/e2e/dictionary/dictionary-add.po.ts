import { getItemByTestId } from 'cypress/utils';

export class DictionaryAdd {
  getComponent() {
    return cy.get('add-dictionary');
  }

  getPopupScrollableArea() {
    return this.getComponent().find('section > div.dictionary');
  }

  getItemsScrollableArea() {
    return this.getComponent().find('.dictionary__items');
  }

  getNewDictionaryNameInput() {
    return getItemByTestId('newDictionaryName').find('input');
  }

  getNewDictionaryDescriptionTextarea() {
    return getItemByTestId('newDictionaryDescription').find('textarea');
  }

  getSaveNewDictionaryButton() {
    return getItemByTestId('saveNewDictionary');
  }

  getToggleExternalApiCheckbox() {
    return getItemByTestId('toggleExternalApiCheckbox').find('label');
  }

  getExternalApiConfigHeader() {
    return getItemByTestId('externalApiConfigHeader');
  }
}
