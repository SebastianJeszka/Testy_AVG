import { getItemByTestId } from 'cypress/utils';

export class DictionaryConfigTree {
  getEmptyDictInfo() {
    return getItemByTestId('emptyDictConfigInfo');
  }

  getAddDictConfigButton() {
    return getItemByTestId('addDictConfigButton');
  }
}
