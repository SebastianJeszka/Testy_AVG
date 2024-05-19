import { getItemByTestId } from 'cypress/utils';

export class DictionaryPage {
  navigateTo() {
    cy.visit('#/dictionaries');
  }

  getDictionaryPageLink() {
    return getItemByTestId('dictionaryPageLink');
  }

  getHeader() {
    return getItemByTestId('dictionaryHeader');
  }

  getNewDictinaryButton() {
    return getItemByTestId('newDictionaryButton');
  }

  getTable() {
    return getItemByTestId('dictionariesTable');
  }

  getFirstTableRow() {
    return this.getTable().find('tr:nth-of-type(2)');
  }

  getLastTableRow() {
    return this.getTable().find('tr:last-of-type');
  }

  getDateCell(row: Cypress.Chainable<JQuery<HTMLElement>>) {
    return row.find('td:last-of-type span');
  }

  getTableHead(name: string) {
    return this.getTable().find('th').contains(name);
  }

  getTableRow(name: string) {
    return this.getTable().find('td').contains(name);
  }

  getLink(name: string) {
    return this.getTable().find('a').contains(name);
  }
}
