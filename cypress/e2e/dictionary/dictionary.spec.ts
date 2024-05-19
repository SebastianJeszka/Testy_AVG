import { DictionaryInterceptor } from 'cypress/interceptor/dictionary.interceptor';
import {
  closeSimpleSnackBar,
  confirmOperation,
  convertToDate,
  // createInitialAppState,
  getSimpleSnackBarWithText,
  // loginByApi,
  navigateToBaseUrl,
  // removeFormByApi
} from 'cypress/utils';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { AddFieldFormPopup } from '../generator/add-field-form/add-field-form.po';
import { FormListPage } from '../generator/form-list/forms-list.po';
import { GeneratorPage } from '../generator/generator-core/generator-component/generator-component.po';
import { DictionaryAdd } from './dictionary-add.po';
import { DictionaryTree } from './dictionary-tree.po';
import { DictionaryView } from './dictionary-view.po';
import { DictionaryPage } from './dictionary.po';

describe('dictionary', () => {
  const formListPage = new FormListPage();
  const generatorPage = new GeneratorPage();
  const dictionaryPage = new DictionaryPage();
  const dictionaryView = new DictionaryView();
  const dictionaryAdd = new DictionaryAdd();
  const dictionaryTree = new DictionaryTree();
  const addFieldFormPopup = new AddFieldFormPopup();
  const dictionaryName = `słownik testy automatyczne ${new Date().toLocaleString()}`;
  const dictionaryDescription = `opis słownika, testy automatyczne ${new Date().toLocaleString()}`;
  let firstFormId: string;
  let secondFormId: string;

  before(() => {
      dictionaryPage.navigateTo();
  });

  it('navigates to dictionary page', () => {
    cy.url().should('include', '/dictionaries');
    dictionaryView.waitForDictionaries();
  });

  it('sort dictionaries list ascending by create date', () => {
    let firstRowDate: Date;
    dictionaryPage.getTableHead('Data utworzenia').click();
    dictionaryPage.getTableHead('Data utworzenia').parent().should('have.class', 'sortable-header--active');
    dictionaryPage
      .getDateCell(dictionaryPage.getFirstTableRow())
      .then((firstRowCell) => {
        firstRowDate = convertToDate(firstRowCell.text());
        return dictionaryPage.getDateCell(dictionaryPage.getLastTableRow());
      })
      .then((lastRowCellText) => {
        const lastRowDate: Date = convertToDate(lastRowCellText.text());

        expect(firstRowDate.getTime() < lastRowDate.getTime()).to.eq(true);
      });
  });

  it('sort dictionaries list descending by create date', () => {
    let firstRowDate: Date;
    dictionaryPage.getTableHead('Data utworzenia').click();
    dictionaryPage.getTableHead('Data utworzenia').parent().should('have.class', 'sortable-header--revert');
    dictionaryPage
      .getDateCell(dictionaryPage.getFirstTableRow())
      .then((firstRowCell) => {
        firstRowDate = convertToDate(firstRowCell.text());
        return dictionaryPage.getDateCell(dictionaryPage.getLastTableRow());
      })
      .then((lastRowCellText) => {
        const lastRowDate: Date = convertToDate(lastRowCellText.text());

        expect(firstRowDate.getTime() > lastRowDate.getTime()).to.eq(true);
      });
  });

  it('opens new dictionary form', () => {
    dictionaryPage.getNewDictinaryButton().click();
    dictionaryAdd.getComponent().should('exist');
  });

  it('creates new dictionary and add three root elements', () => {
    dictionaryAdd.getNewDictionaryNameInput().type(dictionaryName);
    dictionaryAdd.getNewDictionaryDescriptionTextarea().type(dictionaryDescription);

    dictionaryTree.getDictionaryLevelDataTitle().should('not.exist');
    dictionaryTree.getDictionaryLevelDataPlaceholder().should('not.exist');
    dictionaryTree.getDictionaryLevelInfo().should('not.exist');

    dictionaryTree.addNewRootTerm('Pierwszy element');

    dictionaryTree.getShowLevelsDataConfigFormCheckbox().find('input').should('not.be.checked').check({ force: true });
    dictionaryTree.getDictionaryLevelDataTitle().should('be.visible');
    dictionaryTree.getDictionaryLevelDataPlaceholder().should('be.visible');
    dictionaryTree.getDictionaryLevelInfo().contains('Poziom 0');
    dictionaryTree.getDictionaryLevelDataTitle().type('Etykieta dla elemetów poziomu 0');
    dictionaryTree.getDictionaryLevelDataPlaceholder().type('Wybierz element z poziomu 0');

    dictionaryTree.addNewRootTerm('Drugi element');
    dictionaryTree.addNewRootTerm('Trzeci element');

    dictionaryTree.getNewDictionaryTreeItems().should('have.length', 3);
  });

  it('saves new dictionary', () => {
    const newListListener = DictionaryInterceptor.getNewList();
    const saveDictionaryListener = DictionaryInterceptor.saveDictionary();
    dictionaryAdd
      .getSaveNewDictionaryButton()
      .click()
      .wait([newListListener, saveDictionaryListener])
      .wait(500)
      .then(() => {
        dictionaryAdd.getComponent().should('not.exist');
        dictionaryPage.getFirstTableRow().find('td:nth-of-type(1)').should('contain.text', dictionaryName);
      });
  });

  // start generator checkbox field test

  it('navigates to generator page and create new form', () => {
        navigateToBaseUrl();
    });
  

  it('creates checkbox field and use dictionary', () => {
    const labelText = `Etykieta pola ${FieldTypes.CHECKBOX} ze słownikiem ${dictionaryName}`;

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addFieldWithDictionary(FieldTypes.CHECKBOX, labelText, dictionaryName);
    addFieldFormPopup.submitAddFieldForm();

    generatorPage.getFieldWithLabel(labelText).should('exist');
    generatorPage.getFieldCheckboxes(labelText).should('have.length', 3);
    generatorPage.getFieldCheckboxes(labelText).find('label').contains('Pierwszy element').should('exist');
    generatorPage.getFieldCheckboxes(labelText).find('label').contains('Drugi element').should('exist');
    generatorPage.getFieldCheckboxes(labelText).find('label').contains('Trzeci element').should('exist');

    generatorPage.saveForm();
    getSimpleSnackBarWithText('Formularz został zapisany!').should('be.visible');
    closeSimpleSnackBar();
  });

  it('navigates to dictionary page once again', () => {
    dictionaryPage.getDictionaryPageLink().click();
    cy.url().should('include', '/dictionaries');
  });

  // end generator checkbox field test

  it('opens dictionary in read-only mode', () => {
    dictionaryPage.getTableHead('Data utworzenia').click();
    dictionaryPage.getTableHead('Data utworzenia').click();
    dictionaryPage.getTableHead('Data utworzenia').parent().should('have.class', 'sortable-header--revert');

    dictionaryPage.getLink(dictionaryName).click();
    dictionaryView.getDictionaryName().should('contain.text', dictionaryName);
    dictionaryView.getDictionaryDescription().should('contain.text', dictionaryDescription);
    dictionaryView.getComponent().should('exist');
  });

  it('switches dictionary in edit mode', () => {
    dictionaryView.getDictionaryEditButton().click();
    dictionaryView.getDictionaryEditInput().should('exist');
    dictionaryView.getDictionaryEditDescriptionTextarea().should('exist');
    dictionaryTree.getAddRootTermButton().should('exist');
  });

  it('adds subterm to each root element', () => {
    dictionaryTree.addTerm('Pierwszy element', 'Podelement pierwszy');
    dictionaryTree.addTerm('Drugi element', 'Podelement drugi');
    dictionaryTree.addTerm('Trzeci element', 'Podelement trzeci');
    dictionaryTree.getNewDictionaryTreeItems().should('have.length', 6);
  });

  it('removes one root element', () => {
    dictionaryTree.removeTerm('Pierwszy element');
    dictionaryTree.getNewDictionaryTreeItems().should('have.length', 4);
  });

  it('adds one root term and 3 subterm', () => {
    dictionaryTree.getNewDictionaryTreeItemMoreButton('Drugi element').click();
    dictionaryTree.addNewRootTerm('Czwarty element');
    dictionaryTree.addTerm('Czwarty element', 'Podelement czwarty');
    dictionaryTree.addTerm('Czwarty element', 'Podelement piąty');
    dictionaryTree.addTerm('Czwarty element', 'Podelement szósty');
    dictionaryTree.getNewDictionaryTreeItems().should('have.length', 8);

    dictionaryView.getDictionaryEditSaveButton().click();
    dictionaryView.getComponent().should('exist');
    dictionaryPage.getFirstTableRow().find('td:nth-of-type(1)').should('contain.text', dictionaryName);
  });

  // start expandable list field assert in generator form

  it('navigates to generator page and create new form', () => {
        navigateToBaseUrl();
  });

  it('creates select field and use dictionary', () => {
    const labelText = `Etykieta pola ${FieldTypes.SELECT} ze słownikiem ${dictionaryName}`;

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addFieldWithDictionary(FieldTypes.SELECT, labelText, dictionaryName);
    addFieldFormPopup.submitAddFieldForm();

    generatorPage.getFieldWithLabel(labelText).should('exist');

    generatorPage.saveForm();
    getSimpleSnackBarWithText('Formularz został zapisany!').should('exist');
    closeSimpleSnackBar();
  });

  it('navigates to dictionary page once again', () => {
    dictionaryPage.getDictionaryPageLink().click();
    cy.url().should('include', '/dictionaries');
  });

  // end expandable list field assert in generator form

  it('removes dictionary', () => {
    const newListListener = DictionaryInterceptor.getNewList();
    dictionaryPage.getTableHead('Data utworzenia').click();
    dictionaryPage.getTableHead('Data utworzenia').click();
    dictionaryPage.getTableHead('Data utworzenia').parent().should('have.class', 'sortable-header--revert');

    dictionaryPage.getLink(dictionaryName).click();
    dictionaryView.getDictionaryName().should('contain.text', dictionaryName);
    dictionaryView.getDictionaryDescription().should('contain.text', dictionaryDescription);
    dictionaryView.getComponent().should('exist');

    dictionaryView.getRemoveDictionaryButton().click();
    confirmOperation()
      .wait(newListListener)
      .wait(500)
      .then(() => {
        dictionaryPage.getFirstTableRow().find('td:nth-of-type(1)').should('not.contain.text', dictionaryName);
      });
  });

});
