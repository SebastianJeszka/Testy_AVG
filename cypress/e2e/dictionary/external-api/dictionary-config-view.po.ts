import { getItemByTestId } from 'cypress/utils';

export class DictionaryConfigView {
  getComponent() {
    return cy.get('dictionary-config-view');
  }

  getHeader() {
    return getItemByTestId('configViewDictHeader');
  }

  getDictName() {
    return getItemByTestId('configViewDictName');
  }

  getDescriptionTextBlock() {
    return getItemByTestId('configViewDictDescriptionTextBlock');
  }

  getDescriptionInput() {
    return getItemByTestId('configViewDictDescriptionInput');
  }

  getRemoveDictButton() {
    return getItemByTestId('configViewRemoveDict');
  }

  getEditDictButton() {
    return getItemByTestId('configViewEditDict');
  }

  getSaveDictButton() {
    return getItemByTestId('configViewSaveDict');
  }
}
