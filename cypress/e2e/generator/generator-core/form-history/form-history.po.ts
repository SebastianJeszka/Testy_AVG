import { confirmOperation, getItemByTestId } from 'cypress/utils';

export class FormHistory {
  getComponent() {
    return cy.get('form-history');
  }

  getLatestFormVersionRow() {
    return this.getComponent().find('table > tr.table-row').first();
  }

  getLatestFormVersionState() {
    return getItemByTestId('formVersionState');
  }

  getToggleButton() {
    return getItemByTestId('accordionComponentDetailsFormHistoryToggle');
  }

  getFormVersionSettingsContextMenu() {
    return getItemByTestId('formVersionSettings');
  }

  getRemoveFormVersionOption() {
    return getItemByTestId('removeFormVersion');
  }

  expandFormHistory() {
    this.getToggleButton().click();
  }

  deleteFormVersion() {
    this.getFormVersionSettingsContextMenu().click();
    this.getRemoveFormVersionOption().click();
    confirmOperation();
  }
}
