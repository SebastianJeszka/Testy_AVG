import {
  closeSimpleSnackBar,
  generateFormNameWithDate,
  getSimpleSnackBarWithText,
  // loginByApi,
  // removeFormByApi
} from 'cypress/utils';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { DefaultTabLabels, TabType } from 'src/app/_shared/models/tab.model';
import { FormListPage } from '../form-list/forms-list.po';
import { GeneratorPage } from '../generator-core/generator-component/generator-component.po';
import { AddFieldFormPopup } from './add-field-form.po';

describe('add field form', () => {
  const formListPage = new FormListPage();
  const addFieldFormPopup = new AddFieldFormPopup();
  const generatorPage = new GeneratorPage();
  let formId: string;

  before(() => {
      formListPage.navigateTo();
      formListPage.navigateToAddForm();
  });

  it('creates field of type: TEXTFIELD on first page', () => {
    const textFieldLabel = 'Etykieta pola TEXT_FIELD';
    const textFieldSelector = 'mc-input-text input[type=text]';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 0);

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.TEXT_FIELD);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 1);
    generatorPage.getFieldWithLabel(textFieldLabel).should('be.visible');
    generatorPage.getComponentFromActivePage(textFieldSelector).should('be.visible');
  });

  it('edits field label for first field of type: TEXTFIELD on first page', () => {
    const oldLabel = 'Etykieta pola TEXT_FIELD';
    const newLabel = 'Zmieniona etykieta pola TEXT_FIELD';

    generatorPage.getFieldWithLabel(newLabel).should('not.exist');
    generatorPage.getFieldWithLabel(oldLabel).should('be.visible');

    addFieldFormPopup.editQuestionTitleByIndex(0, newLabel);

    generatorPage.getFieldWithLabel(newLabel).should('be.visible');
    generatorPage.getFieldWithLabel(oldLabel).should('not.exist');
  });

  it('deletes field of type: TEXTFIELD on first page', () => {
    generatorPage.getAllFieldsFromActivePage().should('have.length', 1);

    generatorPage.deleteFieldByIndex(0);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 0);
  });

  it('creates field of type: TEXTFIELD on first page after deletion', () => {
    const textFieldLabel = 'Etykieta pola TEXT_FIELD';
    const textFieldSelector = 'mc-input-text input[type=text]';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 0);

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.TEXT_FIELD);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 1);
    generatorPage.getFieldWithLabel(textFieldLabel).should('be.visible');
    generatorPage.getComponentFromActivePage(textFieldSelector).should('be.visible');
  });

  it('creates field of type: CHEKCKBOX on first page', () => {
    const checkboxFieldLabel = 'Etykieta pola CHECKBOX';
    const checkboxFieldSelector = 'mc-input-checkbox';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 1);
    generatorPage.getFieldWithLabel(checkboxFieldLabel).should('not.exist');
    generatorPage.getComponentFromActivePage(checkboxFieldSelector).should('not.exist');

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewFieldWithOptions(FieldTypes.CHECKBOX, ['pierwsza opcja checkbox', 'druga opcja checkbox']);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 2);
    generatorPage.getFieldWithLabel(checkboxFieldLabel).should('be.visible');
    generatorPage.getComponentFromActivePage(checkboxFieldSelector).should('be.visible');
  });

  it('creates field of type: SELECT on first page', () => {
    const selectFieldLabel = 'Etykieta pola SELECT';
    const selectFieldSelector = 'mc-input-select';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 2);
    generatorPage.getFieldWithLabel(selectFieldLabel).should('not.exist');
    generatorPage.getComponentFromActivePage(selectFieldSelector).should('not.exist');

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewFieldWithOptions(FieldTypes.SELECT, ['pierwsza opcja select', 'druga opcja select']);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 3);
    generatorPage.getFieldWithLabel(selectFieldLabel).should('be.visible');
    generatorPage.getComponentFromActivePage(selectFieldSelector).should('be.visible');
  });

  it('creates field of type: RADIO on first page', () => {
    const radioFieldLabel = 'Etykieta pola RADIO';
    const radioFieldSelector = 'mc-input-radio';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 3);
    generatorPage.getFieldWithLabel(radioFieldLabel).should('not.exist');
    generatorPage.getComponentFromActivePage(radioFieldSelector).should('not.exist');

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewFieldWithOptions(FieldTypes.RADIO, ['pierwsza opcja radio', 'druga opcja radio']);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 4);
    generatorPage.getFieldWithLabel(radioFieldLabel).should('be.visible');
    generatorPage.getComponentFromActivePage(radioFieldSelector).should('be.visible');
  });

  it('creates field of type: CONSENT_SECTION on first page', () => {
    const consentFieldLabel = 'Etykieta pola CONSENT_SECTION';
    const consentText = 'Tekst zgody';
    const formattedConsentFieldLabel = 'etykieta_pola_consent_section';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 4);
    generatorPage.getFieldWithLabel(consentFieldLabel).should('not.exist');

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewConsent({ consentTechName: consentFieldLabel, consentText });

    generatorPage.getAllFieldsFromActivePage().should('have.length', 5);
    generatorPage.getFieldWithLabel(formattedConsentFieldLabel).should('be.visible');
    generatorPage.getConsentWithText(consentText).should('be.visible');
  });

  it('edits consent text for given field', () => {
    const newConsentText = 'Pierwsza zgoda';
    addFieldFormPopup.editConsent({ fieldIndex: 4, consentIndex: 0 }, newConsentText);

    generatorPage.getConsentWithText(newConsentText).should('be.visible');
  });

  it('adds another consent text for given field', () => {
    const anotherConsentText = 'Kolejna zgoda';
    addFieldFormPopup.addConsentText({ fieldIndex: 4 }, anotherConsentText);

    generatorPage.getConsentWithText(anotherConsentText).should('be.visible');
  });

  it('removes first consent text for given field', () => {
    addFieldFormPopup.removeConsentText({ fieldIndex: 4, consentIndex: 0 });

    generatorPage.getConsentWithText('Pierwsza zgoda').should('not.exist');
    generatorPage.getConsentWithText('Kolejna zgoda').should('exist');
  });

  it('creates field of type: NUMBER on first page', () => {
    const numberFieldLabel = 'Etykieta pola NUMBER';
    const numberFIeldComponentSelector = 'mc-input-text input[type=number]';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 5);

    generatorPage.getFieldWithLabel(numberFieldLabel).should('not.exist');
    generatorPage.getComponentFromActivePage(numberFIeldComponentSelector).should('not.exist');

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.NUMBER);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 6);
    generatorPage.getFieldWithLabel(numberFieldLabel).should('be.visible');
    generatorPage.getComponentFromActivePage(numberFIeldComponentSelector).should('be.visible');
  });

  it('creates field of type: DATEPICKER on first page', () => {
    const datePickerFieldLabel = 'Etykieta pola DATEPICKER';
    const datePickerFieldSelector = 'mc-input-datepicker';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 6);

    generatorPage.getFieldWithLabel(datePickerFieldLabel).should('not.exist');
    generatorPage.getComponentFromActivePage(datePickerFieldSelector).should('not.exist');

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.DATEPICKER, datePickerFieldLabel);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 7);

    generatorPage.getFieldWithLabel(datePickerFieldLabel).should('be.visible');
    generatorPage.getComponentFromActivePage(datePickerFieldSelector).should('be.visible');
  });

  it('creates field of type: TEXT_BLOCK on first page', () => {
    const textBlockFieldLbel = 'Etykieta pola TEXT_BLOCK';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 7);
    generatorPage.getFieldWithLabel(textBlockFieldLbel).should('not.exist');

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.TEXT_BLOCK, textBlockFieldLbel);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 8);
    generatorPage.getFieldWithLabel(textBlockFieldLbel).should('be.visible');
  });

  it('creates field of type: TEXTAREA on first page', () => {
    const textAreaFieldLabel = 'Etykieta pola TEXTAREA';
    const textAreaFieldSelector = 'mc-input-textarea';

    generatorPage.getAllFieldsFromActivePage().should('have.length', 8);
    generatorPage.getFieldWithLabel(textAreaFieldLabel).should('not.exist');
    generatorPage.getComponentFromActivePage(textAreaFieldSelector).should('not.exist');

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.TEXTAREA, textAreaFieldLabel);

    generatorPage.getAllFieldsFromActivePage().should('have.length', 9);
    generatorPage.getFieldWithLabel(textAreaFieldLabel).should('be.visible');
    generatorPage.getComponentFromActivePage(textAreaFieldSelector).should('be.visible');
  });

  it('prevents from creating form containing page without any fields', () => {
    generatorPage.setFormTechName(generateFormNameWithDate());
    generatorPage.saveForm();

    getSimpleSnackBarWithText('Każda strona musi zawierać przynajmniej 1 pole').should('be.visible');

    closeSimpleSnackBar();
  });

  it('updates form with all added fields', () => {
    generatorPage.switchToPageWithLabel(DefaultTabLabels[TabType.FINISH]);
    generatorPage.openAddFieldForm();
    addFieldFormPopup.addNewField(FieldTypes.TEXTAREA, 'etykieta na drugiej stronie');

    generatorPage.saveForm();

    getSimpleSnackBarWithText('Formularz został zapisany!').should('be.visible');

    closeSimpleSnackBar();

    formListPage.chooseFormWithName(generatorPage.formTechName);
    cy.url().should('include', '/generator/view/');
    cy.url().then((url) => {
      formId = url.substring(url.lastIndexOf('/') + 1);
    });
  });
});
