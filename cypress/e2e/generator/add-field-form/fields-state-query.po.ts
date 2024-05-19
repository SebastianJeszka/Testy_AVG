import { getItemByTestId } from "cypress/utils";

export class FieldStateQueryComponentPO {

  getEditQueryStateHeader() {
    return getItemByTestId('editQueryStateHeader');
  }

  getCloseQueryPopupButton() {
    return getItemByTestId('closeQueryPopupButton');
  }

  getJsonViewer() {
    return getItemByTestId('jsonViewer');
  }

  getQueryMonacoEditor() {
    return getItemByTestId('queryMonacoEditor');
  }

  getQueryResult() {
    return getItemByTestId('queryResult');
  }

  getCancelStateQueryEdtionBtn() {
    return getItemByTestId('cancelStateQueryEditionBtn');
  }

  getSaveStateQueryEdtionBtn() {
    return getItemByTestId('saveStateQueryEditionBtn');
  }
}
