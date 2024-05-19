import { getItemByTestId } from 'cypress/utils';

export class DictionaryTree {
  getAddRootTermButton() {
    return getItemByTestId('addRootTermButton');
  }

  getNewDictionaryItemComponent() {
    return getItemByTestId('newDictionaryItemForm');
  }

  getNewDictionaryTree() {
    return getItemByTestId('newDictionaryTree');
  }

  getNewDictionaryTreeItems() {
    return getItemByTestId('newDictionaryTreeItem');
  }

  getNewDictionaryTreeItem(name: string) {
    return this.getNewDictionaryTree().find('.branch-header').contains(name);
  }

  getNewDictionaryTreeItemMoreButton(name: string) {
    return this.getNewDictionaryTreeItems().contains(name).parent().find('button');
  }

  getNewDictionaryTreeItemAddSubtermButton() {
    return getItemByTestId('addTermButton');
  }

  getNewDictionaryTreeItemRemoveTermButton() {
    return getItemByTestId('removeTermButton');
  }

  getNewDictionaryItemInput() {
    return getItemByTestId('newDictionaryTermInput').find('input#term');
  }

  getNewDictionaryTermSaveButton() {
    return getItemByTestId('newDictionaryTermSaveButton');
  }

  getShowLevelsDataConfigFormCheckbox() {
    return getItemByTestId('showLevelsDataConfigFormCheckbox');
  }

  getDictionaryLevelDataTitle() {
    return getItemByTestId('dictionaryLevelDataTitle');
  }

  getDictionaryLevelDataPlaceholder() {
    return getItemByTestId('dictionaryLevelDataPlaceholder');
  }

  getDictionaryLevelInfo() {
    return getItemByTestId('dictionaryLevelInfo');
  }

  addNewRootTerm(name: string) {
    this.getAddRootTermButton().click();
    this.getNewDictionaryItemInput().type(name);
    this.getNewDictionaryTermSaveButton().click();
    this.getNewDictionaryTreeItem(name).should('exist');
  }

  removeTerm(name: string) {
    this.getNewDictionaryTreeItemMoreButton(name).click();
    this.getNewDictionaryTreeItemRemoveTermButton().click();
  }

  addTerm(parent: string, name: string) {
    this.getNewDictionaryTreeItemMoreButton(parent).click();
    this.getNewDictionaryTreeItemAddSubtermButton().click();
    this.getNewDictionaryItemInput().type(name);

    this.getNewDictionaryTermSaveButton().click();
    this.getNewDictionaryTreeItem(name).should('exist');
    this.getNewDictionaryTreeItemAddSubtermButton().should('not.exist');
  }
}
