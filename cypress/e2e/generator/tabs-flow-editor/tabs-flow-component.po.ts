import { getItemByTestId } from 'cypress/utils';

export class TabsFlowViewPO {
  getTabsFlowComponent() {
    return cy.get('tabs-flow');
  }

  getHeader() {
    return getItemByTestId('tabsFlowHeader');
  }

  getSaveFlowButton() {
    return getItemByTestId('saveFLowButton');
  }

  getBackToGeneratorLink() {
    return getItemByTestId('backToGeneratorLink');
  }

  // graf
  getOneLink() {
    return getItemByTestId('grafLink');
  }

  getGrafNodes() {
    return getItemByTestId(`grafNode`);
  }

  getOneNodeByLabel(label?: string) {
    return getItemByTestId(`grafNode`).get(`[data-testName="${label}"]`);
  }

  getGrafContextMenuOption() {
    return cy.get('.ngx-contextmenu button');
  }

  getGraphValidationMessage() {
    return getItemByTestId('graphValidationMessage');
  }

  openProcessPopupForNode(nodeName: string) {
    this.getGrafNodes().find('label').contains(nodeName).should('exist').rightclick({ force: true });
    this.getGrafContextMenuOption().contains(' Zarządzaj procesami strony ').click({ force: true });
  }

  openCreateCopyPopupForNode(nodeName: string) {
    this.getGrafNodes().find('label').contains(nodeName).should('exist').rightclick({ force: true });
    this.getGrafContextMenuOption().contains(' Zarządzaj kopiami strony ').click({ force: true });
  }

  openEditCopyPopupForNode(nodeName: string) {
    this.getGrafNodes().find('label').contains(nodeName).should('exist').rightclick({ force: true });
    this.getGrafContextMenuOption().contains(' Edytuj konfiguracje kopii ').click({ force: true });
  }

  checkIfCopyExistAlready(copyName: string) {
    this.getGrafNodes().find('label').contains(copyName).should('exist');
  }
}

