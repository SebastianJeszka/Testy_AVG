import { getItemByTestId } from 'cypress/utils';
export class NavigationStep {
  getEnableNavigationCheckbox() {
    return getItemByTestId('enableNavigation').find('label');
  }

  getComponent() {
    return cy.get('navigation-steps');
  }

  getAddStepButton() {
    return getItemByTestId('addNavigationStep');
  }

  getNavigationStepInput(index: number) {
    return getItemByTestId('navigationStepItem').eq(index).find('input');
  }

  getNavigationStepButtonUp(index: number) {
    return getItemByTestId('navigationStepItem').eq(index).find('.gov-icon--arrow-up');
  }

  getNavigationStepButtonDown(index: number) {
    return getItemByTestId('navigationStepItem').eq(index).find('.gov-icon--arrow-down');
  }

  getNavigationStepSelect() {
    return getItemByTestId('pageStepSelect').find('mat-select');
  }

  getNavigationStepSelectId() {
    return this.getNavigationStepSelect().invoke('attr', 'ng-reflect-name');
  }

  clickStepOption(name: string) {
    this.getNavigationStepSelect().click();
    cy.get('mat-option').contains(name).click();
  }

  enableNavigationSteps() {
    this.getEnableNavigationCheckbox().click();
  }

  addNavigationStep(name: string, index: number) {
    this.getAddStepButton().click();
    this.getNavigationStepInput(index).type(name);
  }

  selectNavigationStep() {
    this.getNavigationStepSelect().click();
  }

  checkNavigationStepsCorrectOrder(correctOrder: string[]) {
    correctOrder.forEach((stepName: string, index: number) => {
      this.getNavigationStepInput(index).should('have.value', stepName);
    });
  }
}
