import { getItemByTestId } from 'cypress/utils';

export class DictionaryConfigItem {
  getComponent() {
    return cy.get('dictionary-config-item');
  }

  getHeader() {
    return getItemByTestId('dictItemHeader');
  }

  getSourceUrlFromLevel(dictLevel: number) {
    return getItemByTestId('dictItemSourceUrl').find('input').eq(dictLevel);
  }

  getLabelPropertyNameFromLevel(dictLevel: number) {
    return getItemByTestId('dictItemLabelPropertyName').find('input').eq(dictLevel);
  }

  getValuePropertyNameFromLevel(dictLevel: number) {
    return getItemByTestId('dictItemValuePropertyName').find('input').eq(dictLevel);
  }

  getParamNameFromLevel(dictLevel: number) {
    return getItemByTestId('dictItemParamName').find('input').eq(dictLevel);
  }

  getDictLevelFromLevel(dictLevel: number) {
    return getItemByTestId('dictItemDictLevel').find('input').eq(dictLevel);
  }

  getToggleActions() {
    return getItemByTestId('toggleDictItemActions');
  }

  getToggleShowConfigForm() {
    return getItemByTestId('toggleShowConfigForm');
  }

  getRemoveCurrentConfigButton() {
    return getItemByTestId('removeCurrentConfig');
  }
}
