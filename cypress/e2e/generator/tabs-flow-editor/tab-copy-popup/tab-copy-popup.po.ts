import { getItemByTestId } from "cypress/utils";

export class TabCopyPopupPO {
  getCopyPopupHeader() {
    return getItemByTestId('headerCopiesPopup');
  }

  getFieldCheckboxes() {
    return getItemByTestId('fieldCheckboxInCopy');
  }

  getSaveButton() {
    return getItemByTestId('copyPopupSaveButton');
  }

  getCancelButton() {
    return getItemByTestId('copyPopupCancelButton');
  }
}
