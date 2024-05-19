import { flowConfigForTabCopyPopup, tabsConfigForCopyPopup } from "cypress/fixtures/tab-copy-popup-form-config";
import { chooseFormWithName, getSimpleSnackBarWithText, goToTabsFlowComponent, navigateToBaseUrl, closeSimpleSnackBar } from "cypress/utils";
import { DefaultTabLabels, TabType } from "src/app/_shared/models/tab.model";
import { AddLinkFormPO } from "../add-link-form-component.po";
import { TabsFlowViewPO } from "../tabs-flow-component.po";
import { TabCopyPopupPO } from "./tab-copy-popup.po";

describe('tab copy popup', () => {
  let formId: string;
  let tabsFlowView: TabsFlowViewPO = new TabsFlowViewPO();
  let tabCopyPopup: TabCopyPopupPO = new TabCopyPopupPO();
  let addLinkFormPage: AddLinkFormPO = new AddLinkFormPO();

  before(() => {
        navigateToBaseUrl();
  });

  it('should navigate to tabs flow view', () => {
    goToTabsFlowComponent();
    cy.url().should('include', '/generator/flow/');
  });

  it('open copy popup - should appear content', () => {
    tabsFlowView.openCreateCopyPopupForNode(DefaultTabLabels[TabType.MAIN]);
    tabCopyPopup.getCopyPopupHeader().should('exist');
    tabCopyPopup.getFieldCheckboxes().should('exist');
  });

  it('check 1 field and save - shoud appear snackbar warning', () => {
    tabCopyPopup.getFieldCheckboxes().first().find('input').check({ force: true });
    tabCopyPopup.getSaveButton().click();
    getSimpleSnackBarWithText('Żeby zrobić kopie strony, ta strona musi mieć przynajmniej 2 pola').should('be.visible');
    tabCopyPopup.getCancelButton().click();
    tabCopyPopup.getCopyPopupHeader().should('not.exist');
    closeSimpleSnackBar();
  });

  it('not check any fields and save - shoud appear snackbar warning', () => {
    tabsFlowView.openCreateCopyPopupForNode('s2');
    tabCopyPopup.getSaveButton().click();
    getSimpleSnackBarWithText('Nie wybrano pól do ukrycia').should('be.visible');
    closeSimpleSnackBar();
  });

  it('hide all fields - shoud appear snackbar warning', () => {
    tabCopyPopup.getFieldCheckboxes().each(($el) => {
      cy.wrap($el).find('input').check({ force: true });
    });
    tabCopyPopup.getSaveButton().click();
    getSimpleSnackBarWithText('Nie mogą być ukryte wszystkie pola na stronie').should('be.visible');
    closeSimpleSnackBar();
    tabCopyPopup.getCancelButton().click();
    tabCopyPopup.getCopyPopupHeader().should('not.exist');
  });

  it('create copy - shoud appear on graph', () => {
    tabsFlowView.openCreateCopyPopupForNode('s2');
    tabCopyPopup.getFieldCheckboxes().eq(0).find('input').check({ force: true });
    tabCopyPopup.getFieldCheckboxes().eq(1).find('input').check({ force: true });
    tabCopyPopup.getSaveButton().click();
    tabsFlowView.getTabsFlowComponent().scrollTo('bottom', { ensureScrollable: false });
    tabCopyPopup.getCopyPopupHeader().should('not.exist');
    tabsFlowView.checkIfCopyExistAlready('s2_1');
  });

  it('create second copy - should appear on graph', () => {
    tabsFlowView.openCreateCopyPopupForNode('s2');
    tabCopyPopup.getFieldCheckboxes().eq(0).find('input').check({ force: true });
    tabCopyPopup.getFieldCheckboxes().eq(1).find('input').check({ force: true });
    tabCopyPopup.getSaveButton().click();
    getSimpleSnackBarWithText(`Taka kopia już istnieje, o nazwie: s2_1`).should('be.visible');
    closeSimpleSnackBar();
    tabCopyPopup.getFieldCheckboxes().eq(1).find('input').uncheck({ force: true });
    tabCopyPopup.getSaveButton().click();
    tabsFlowView.getTabsFlowComponent().scrollTo('bottom', { ensureScrollable: false });
    tabCopyPopup.getCopyPopupHeader().should('not.exist');
    tabsFlowView.checkIfCopyExistAlready('s2_2');
  });

  it('edit copy - should appear warning about existed copy', () => {
    tabsFlowView.openEditCopyPopupForNode('s2_2');
    tabCopyPopup.getFieldCheckboxes().eq(1).find('input').check({ force: true });
    tabCopyPopup.getSaveButton().click();
    getSimpleSnackBarWithText(`Taka kopia już istnieje, o nazwie: s2_1`).should('be.visible');
    closeSimpleSnackBar();
    tabCopyPopup.getFieldCheckboxes().eq(0).find('input').uncheck({ force: true });
    tabCopyPopup.getFieldCheckboxes().eq(2).find('input').check({ force: true });
    tabCopyPopup.getSaveButton().click();
    tabsFlowView.getTabsFlowComponent().scrollTo('bottom', { ensureScrollable: false });
    tabsFlowView.checkIfCopyExistAlready('s2_2');
  });

  it('edit copy - should appear message about existing steps from copy', () => {
    addLinkFormPage.addStepStartEnd(DefaultTabLabels[TabType.MAIN], 's2_1');
    addLinkFormPage.getSaveLinkButton().click();
    addLinkFormPage.addStepStartEnd('s2_1', DefaultTabLabels[TabType.FINISH]);
    addLinkFormPage.getSaveLinkButton().click();
    addLinkFormPage.addStepStartEnd('s2_1', 's3');
    addLinkFormPage.getQueryNameInputForNewStep().type('Step 2');
    addLinkFormPage.addSimpleRule();
    addLinkFormPage.selectFieldForRule('s2_i3');
    addLinkFormPage.getQueryValueInput().type('1');
    addLinkFormPage.getSaveLinkButton().click();
    tabsFlowView.openEditCopyPopupForNode('s2_1');
    tabCopyPopup.getFieldCheckboxes().eq(2).find('input').check({ force: true });
    tabCopyPopup.getSaveButton().click();
    getSimpleSnackBarWithText('Niektóre zaznaczone pola (s2_i3) są używane w warunkach kroków wychodzących z tej kopii')
    .should('be.visible');
  });

});
