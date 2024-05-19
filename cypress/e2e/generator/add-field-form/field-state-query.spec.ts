import { baseTestTextField } from "cypress/fixtures/form-version.mock";
import { navigateToBaseUrl,  } from "cypress/utils";
import { QuestionFieldStates, stateLabels } from "src/app/_shared/models/question-field.model";
import { DefaultTabLabels, TabType } from "src/app/_shared/models/tab.model";
import { FormListPage } from "../form-list/forms-list.po";
import { AddFieldFormPopup } from "./add-field-form.po";
import { FieldStateQueryComponentPO } from "./fields-state-query.po";

describe('fields dependencies editor jsonata', () => {
  let formListPage: FormListPage;
  let addFieldFormPopup: AddFieldFormPopup;
  let fieldStateQueryPopup: FieldStateQueryComponentPO;
  let formId: string;
  const jsonataCommandForTab = 'tabs[0].title';
  const jsonataCommandForField = `tabs['${DefaultTabLabels[TabType.MAIN]}' in title].questions['${baseTestTextField.techName}' in field.techName].field.title`;

  before(() => {
    formListPage = new FormListPage();
    addFieldFormPopup = new AddFieldFormPopup();
    fieldStateQueryPopup = new FieldStateQueryComponentPO();
      navigateToBaseUrl();
  });

  it('open field edition - should appear dynamics states checkbox', () => {
    addFieldFormPopup.openEditionPopupForField(0);
    addFieldFormPopup.getDynamicStatesHeader().should('exist');
    addFieldFormPopup.getDynamicStatesFieldCheckbox().should('exist');
  });

  it('enable dynamic state - should appear dynamics states checkbox', () => {
    addFieldFormPopup.getDynamicStatesFieldCheckbox().check({ force: true });
    addFieldFormPopup.getAddFieldFormContent().scrollTo('bottom');
    addFieldFormPopup.getDynamicStatesOfFieldSelect().should('exist');
    addFieldFormPopup.getStateQueryCommandInput().should('exist');
    addFieldFormPopup.getEditQueryCommandBtn().should('exist');
  });

  it('choose state for field and edit query - should appear query edit popup', () => {
    addFieldFormPopup.chooseDynamicStateForField(stateLabels[QuestionFieldStates.HIDDEN]);
    addFieldFormPopup.getStateQueryCommandInput().type(' ');
    fieldStateQueryPopup.getEditQueryStateHeader().should('exist');
    fieldStateQueryPopup.getCloseQueryPopupButton().should('exist');
    fieldStateQueryPopup.getJsonViewer().should('exist');
    fieldStateQueryPopup.getQueryMonacoEditor().should('exist');
    fieldStateQueryPopup.getQueryResult().should('exist');
  });

  it('write command to monaco editor - should appear result', () => {
    fieldStateQueryPopup.getQueryMonacoEditor().find('textarea').type(jsonataCommandForTab);
    fieldStateQueryPopup.getQueryResult().should("have.text", `"${DefaultTabLabels[TabType.MAIN]}"`);
  });

  it('save editor changes - command should appear in query input', () => {
    fieldStateQueryPopup.getSaveStateQueryEdtionBtn().click();
    addFieldFormPopup.getStateQueryCommandInput().should("contain.value", jsonataCommandForTab);
  });

  it('edit query - should appear new result', () => {
    addFieldFormPopup.getEditQueryCommandBtn().click();
    fieldStateQueryPopup.getQueryResult().should("have.text", `"${DefaultTabLabels[TabType.MAIN]}"`);
    fieldStateQueryPopup.getQueryMonacoEditor()
      .find('textarea')
      .type('{ctrl}a')
      .type(jsonataCommandForField);
    fieldStateQueryPopup.getQueryResult().should("have.text", `"${baseTestTextField.title}"`);
    fieldStateQueryPopup.getSaveStateQueryEdtionBtn().click();
    addFieldFormPopup.getStateQueryCommandInput().should("contain.value", jsonataCommandForField);
  });
});
