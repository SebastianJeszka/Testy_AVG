export class DictionaryInterceptor {
  static getNewList() {
    cy.intercept({
      method: 'GET',
      url: '/api/form-generator/dictionary'
    }).as('getNewList');

    return '@getNewList';
  }

  static saveDictionary(){
    cy.intercept({
      method: 'POST',
      url: '/api/form-generator/dictionary'
    }).as('saveDictionary');

    return '@saveDictionary';
  }
}
