import { AddFieldFormPopup } from 'cypress/e2e/generator/add-field-form/add-field-form.po';
import { FormListPage } from 'cypress/e2e/generator/form-list/forms-list.po';
import { GeneratorPage } from 'cypress/e2e/generator/generator-core/generator-component/generator-component.po';
import { DictionaryInterceptor } from 'cypress/interceptor/dictionary.interceptor';
import {
  closeSimpleSnackBar,
  confirmOperation,
  // createInitialAppState,
  getOptionByLabel,
  getSelectScrollableContainer,
  getSimpleSnackBarWithText,
  // loginByApi,
  navigateToBaseUrl,
  // removeFormByApi
} from 'cypress/utils';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { FormVersionTypes } from 'src/app/_shared/models/form-version.model';
import { DictionaryAdd } from '../dictionary-add.po';
import { DictionaryView } from '../dictionary-view.po';
import { DictionaryPage } from '../dictionary.po';
import { DictionaryConfigForm } from './dictionary-config-form.po';
import { DictionaryConfigItem } from './dictionary-config-item.po';
import { DictionaryConfigTree } from './dictionary-config-tree.po';
import { DictionaryConfigView } from './dictionary-config-view.po';

const TERYT_BASE_URL = 'http://3.74.46.241:8091/app/teryt/api/v1/';
const TERYT_CONFIG = {
  voivodeships: `${TERYT_BASE_URL}terc/voivodeships`,
  districtsWithParameter: `${TERYT_BASE_URL}terc/voivodeships/20/districts`,
  districtsGeneric: `${TERYT_BASE_URL}terc/voivodeships/{{}voivodeshipId{}}/districts`,
  paramNames: ['voivodeshipId']
};
const dictionary = {
  name: `słownik z zewnętrznym API ${new Date().toLocaleString()}`,
  description: 'teryt z 2 poziomami - województwa i powiaty',
  dictionaryLevelsData: [
    {
      title: 'Województwo',
      placeholder: 'Wybierz województwo'
    },
    {
      title: 'Powiat',
      placeholder: 'Wybierz powiat'
    }
  ]
};

describe.skip('creating dictionary with external API', () => {
  const dictionaryPage = new DictionaryPage();
  const dictionaryView = new DictionaryView();
  const dictionaryAdd = new DictionaryAdd();
  const dictionaryConfigTree = new DictionaryConfigTree();
  const dictionaryConfigForm = new DictionaryConfigForm();
  const dictionaryConfigItem = new DictionaryConfigItem();

  before(() => {
      dictionaryPage.navigateTo();
      cy.url().should('include', '/dictionaries');
      dictionaryView.waitForDictionaries();
  });

  it('opens new dictionary form', () => {
    dictionaryPage.getNewDictinaryButton().click();
    dictionaryAdd.getComponent().should('exist');
  });

  it('enables adding configuration for dictionary with external API', () => {
    dictionaryAdd.getNewDictionaryNameInput().type(dictionary.name);
    dictionaryAdd.getNewDictionaryDescriptionTextarea().type(dictionary.description);
    dictionaryAdd.getToggleExternalApiCheckbox().click();

    dictionaryAdd.getExternalApiConfigHeader().contains('Konfiguracja słownika z zewnętrznym API');
    dictionaryConfigTree.getEmptyDictInfo().should('be.visible');
    dictionaryConfigTree.getAddDictConfigButton().should('be.visible');
  });

  it('starts filling external API configuration', () => {
    dictionaryConfigTree.getAddDictConfigButton().click();
    dictionaryConfigForm.getExternalApiParametrizedUrl().should('be.visible');
    dictionaryConfigForm.getExternalApiFieldsButton().should('be.disabled');

    dictionaryConfigForm.configureExternalApiUrl(TERYT_CONFIG.voivodeships);
    dictionaryConfigForm.getExternalApiFields();
    dictionaryAdd.getPopupScrollableArea().scrollTo('bottom');
    dictionaryAdd.getItemsScrollableArea().scrollTo('bottom');

    dictionaryConfigForm.getToggleAdditionalParams().should('be.disabled');
    dictionaryConfigForm.getNoParamsOnFirstLevelInfo().should('exist');

    dictionaryConfigForm.getSaveButton().should('be.disabled');
    dictionaryConfigForm.getCancelButton().should('exist');
    dictionaryConfigForm.getCancelButton().focus().click({ force: true });

    dictionaryAdd.getExternalApiConfigHeader().contains('Konfiguracja słownika z zewnętrznym API');
    dictionaryConfigTree.getEmptyDictInfo().should('be.visible');
    dictionaryConfigTree.getAddDictConfigButton().should('be.visible');
  });

  it('fills new dictionary configuration for teryt API (first level - voivodeships)', () => {
    dictionaryConfigTree.getAddDictConfigButton().click();

    dictionaryConfigForm.configureExternalApiUrl(TERYT_CONFIG.voivodeships);
    dictionaryConfigForm.getExternalApiFields();
    dictionaryAdd.getPopupScrollableArea().scrollTo('bottom');
    dictionaryAdd.getItemsScrollableArea().scrollTo('bottom');

    dictionaryConfigForm.getSaveButton().should('be.disabled');
    dictionaryAdd.getItemsScrollableArea().scrollTo('bottom');
    dictionaryConfigForm.configureLabelAndValueProperies();
    dictionaryConfigForm.getDictionaryLevelTitleInput().type(dictionary.dictionaryLevelsData[0].title);
    dictionaryConfigForm.getDictionaryLevelPlaceholderInput().type(dictionary.dictionaryLevelsData[0].placeholder);

    dictionaryConfigForm.getSaveButton().should('be.enabled');
  });

  it('saves first level of configuration', () => {
    dictionaryConfigForm.getSaveButton().should('be.enabled');
    dictionaryConfigForm.getSaveButton().click();

    dictionaryConfigItem.getComponent().should('be.visible');
    dictionaryConfigItem.getToggleActions().should('exist');
  });

  it('removes first level of configuration', () => {
    dictionaryConfigItem.getToggleActions().click();
    dictionaryConfigItem.getRemoveCurrentConfigButton().click();

    dictionaryAdd.getExternalApiConfigHeader().contains('Konfiguracja słownika z zewnętrznym API');
    dictionaryConfigTree.getEmptyDictInfo().should('be.visible');
    dictionaryConfigTree.getAddDictConfigButton().should('be.visible');
  });

  it('adds configuration with two levels (voivodeships and districts)', () => {
    dictionaryConfigTree.getAddDictConfigButton().click();

    dictionaryConfigForm.configureExternalApiUrl(TERYT_CONFIG.voivodeships);
    dictionaryConfigForm.getExternalApiFields();
    dictionaryAdd.getPopupScrollableArea().scrollTo('bottom');
    dictionaryAdd.getItemsScrollableArea().scrollTo('bottom');

    dictionaryConfigForm.configureLabelAndValueProperies();
    dictionaryConfigForm.getDictionaryLevelTitleInput().type(dictionary.dictionaryLevelsData[0].title);
    dictionaryConfigForm.getDictionaryLevelPlaceholderInput().type(dictionary.dictionaryLevelsData[0].placeholder);

    dictionaryConfigForm.getSaveButton().click();

    dictionaryConfigItem.getToggleActions().click();
    dictionaryConfigItem.getToggleShowConfigForm().click();

    dictionaryConfigForm.configureExternalApiUrl(TERYT_CONFIG.districtsWithParameter);
    dictionaryConfigForm.getExternalApiFields();
    dictionaryAdd.getPopupScrollableArea().scrollTo('bottom');
    dictionaryAdd.getItemsScrollableArea().scrollTo('bottom');

    dictionaryConfigForm.configureLabelAndValueProperies();
    dictionaryConfigForm.getDictionaryLevelTitleInput().type(dictionary.dictionaryLevelsData[1].title);
    dictionaryConfigForm.getDictionaryLevelPlaceholderInput().type(dictionary.dictionaryLevelsData[1].placeholder);

    dictionaryConfigForm.getToggleAdditionalParams().should('be.enabled');
    dictionaryAdd.getPopupScrollableArea().scrollTo('bottom');
    dictionaryAdd.getItemsScrollableArea().scrollTo('bottom');

    dictionaryConfigForm.getToggleAdditionalParams().click({ force: true });
    dictionaryAdd.getItemsScrollableArea().scrollTo('bottom');

    dictionaryConfigForm.getGenericSourceUrlInput().should('be.visible');
    dictionaryConfigForm
      .getGenericSourceUrlInput()
      .clear()
      .type(TERYT_CONFIG.districtsGeneric, { parseSpecialCharSequences: true });

    dictionaryConfigForm.getAddFirstParameterButton().click();
    dictionaryAdd.getItemsScrollableArea().scrollTo('bottom');

    dictionaryConfigForm.getParamNameInput().should('be.visible');
    dictionaryConfigForm.getDictLevel().should('be.visible');

    dictionaryConfigForm.getParamNameInput().type(TERYT_CONFIG.paramNames[0]);
    dictionaryConfigForm.getDictLevel().click();
    getOptionByLabel('0').click();

    dictionaryConfigForm.getSaveButton().click();

    dictionaryConfigItem.getComponent().should('be.visible');
    dictionaryConfigItem.getToggleActions().should('exist');
  });

  it('saves new dictionary with external API config', () => {
    dictionaryAdd.getSaveNewDictionaryButton().click();
    dictionaryView.waitForDictionaries();
    dictionaryAdd.getComponent().should('not.exist');
  });
});

describe.skip('using created dictionary in form generator', () => {
  const formListPage = new FormListPage();
  const generatorPage = new GeneratorPage();
  const addFieldFormPopup = new AddFieldFormPopup();
  const TERYT_TESTING_DATA = {
    sampleVoivodeships: ['Mazowieckie', 'Lubelskie', 'Śląskie'],
    sampleMazovianDistricts: ['legionowski', 'płocki', 'płoński'],
    voivodeshipsCount: 16
  };
  let formId: string;

  before(() => {
        navigateToBaseUrl();
    });

  it('adds checkbox field with options from created external dict (one-level-dict)', () => {
    const labelText = `Etykieta pola ${FieldTypes.CHECKBOX} ze słownikiem ${dictionary.name}`;

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addFieldWithDictionary(FieldTypes.CHECKBOX, labelText, dictionary.name);
    addFieldFormPopup.submitAddFieldForm();

    generatorPage.getFieldWithLabel(labelText).should('exist');
    generatorPage.getFieldCheckboxes(labelText).should('have.length', TERYT_TESTING_DATA.voivodeshipsCount);
    TERYT_TESTING_DATA.sampleVoivodeships.forEach((voivodeship) => {
      generatorPage.getFieldCheckboxes(labelText).find('label').contains(voivodeship).should('exist');
    });

    generatorPage.saveForm();
    getSimpleSnackBarWithText('Formularz został zapisany!').should('be.visible');
    closeSimpleSnackBar();
  });

  it('adds radio field with options from created external dict (one-level-dict)', () => {
    const labelText = `Etykieta pola ${FieldTypes.RADIO} ze słownikiem ${dictionary.name}`;

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addFieldWithDictionary(FieldTypes.RADIO, labelText, dictionary.name);
    addFieldFormPopup.submitAddFieldForm();

    generatorPage.getFieldWithLabel(labelText).should('exist');
    generatorPage.getFieldRadioButtons(labelText).should('have.length', TERYT_TESTING_DATA.voivodeshipsCount);
    TERYT_TESTING_DATA.sampleVoivodeships.forEach((voivodeship) => {
      generatorPage.getFieldRadioButtons(labelText).find('label').contains(voivodeship).should('exist');
    });

    generatorPage.saveForm();
    getSimpleSnackBarWithText('Formularz został zapisany!').should('be.visible');
    closeSimpleSnackBar();
  });

  it('adds select field with options from created external dict (two-levels-dict)', () => {
    const labelText = `Etykieta pola ${FieldTypes.SELECT} ze słownikiem ${dictionary.name}`;

    generatorPage.openAddFieldForm();
    addFieldFormPopup.addFieldWithDictionary(FieldTypes.SELECT, labelText, dictionary.name);

    addFieldFormPopup.getDictionaryLevelInfo().contains('Poziom 0');
    addFieldFormPopup.getDictionaryLevelInfo().contains('Poziom 1');

    [0, 1].forEach((dictionaryLevel) => {
      addFieldFormPopup.getDictionaryLevelTitle().eq(dictionaryLevel).should('include.text', 'Etykieta');
      addFieldFormPopup
        .getDictionaryLevelTitle()
        .eq(dictionaryLevel)
        .find('input')
        .should('have.value', dictionary.dictionaryLevelsData[dictionaryLevel].title);
      addFieldFormPopup
        .getDictionaryLevelPlaceholder()
        .eq(dictionaryLevel)
        .should('include.text', 'Tekst zastępczy (placeholder)');
      addFieldFormPopup
        .getDictionaryLevelPlaceholder()
        .eq(dictionaryLevel)
        .find('input')
        .should('have.value', dictionary.dictionaryLevelsData[dictionaryLevel].placeholder);
    });

    addFieldFormPopup.submitAddFieldForm();

    generatorPage.getFieldWithLabel(labelText).should('exist');
    generatorPage.getFieldSelects(labelText).should('have.length', 1);
    generatorPage.getFieldSelects(labelText).click();
    getSelectScrollableContainer().scrollTo('bottom');
    TERYT_TESTING_DATA.sampleVoivodeships.forEach((voivodeship) => {
      getOptionByLabel(voivodeship).should('exist');
      getSelectScrollableContainer().scrollTo('center');
    });
    getSelectScrollableContainer().scrollTo('bottom');
    getOptionByLabel(TERYT_TESTING_DATA.sampleVoivodeships[0]).click();

    generatorPage.getFieldSelects(labelText).should('have.length', 2);
    generatorPage.getFieldSelects(labelText).eq(1).click();
    TERYT_TESTING_DATA.sampleMazovianDistricts.forEach((mazovianDistrict) => {
      getOptionByLabel(mazovianDistrict).should('exist');
    });
    getOptionByLabel(TERYT_TESTING_DATA.sampleMazovianDistricts[0]).click();

    generatorPage.saveForm();
    getSimpleSnackBarWithText('Formularz został zapisany!').should('exist');
    closeSimpleSnackBar();
  });

describe.skip('editing and deleting dictionary with external API', () => {
  const dictionaryPage = new DictionaryPage();
  const dictionaryConfigView = new DictionaryConfigView();
  const dictionaryConfigItem = new DictionaryConfigItem();

  before(() => {
    const newListListener = DictionaryInterceptor.getNewList();
    dictionaryPage.getDictionaryPageLink().click();
    cy.wait(newListListener).then(() => {
      cy.url().should('include', '/dictionaries');
    });
  });

  it('opens dictionary in read-only mode', () => {
    dictionaryPage.getTableHead('Data utworzenia').click();
    dictionaryPage.getTableHead('Data utworzenia').click();
    dictionaryPage.getTableHead('Data utworzenia').parent().should('have.class', 'sortable-header--revert');

    dictionaryPage.getLink(dictionary.name).click();
    dictionaryConfigView.getHeader().contains(dictionary.name);
    dictionaryConfigView.getDescriptionTextBlock().should('contain.text', dictionary.description);
    dictionaryConfigView.getComponent().should('exist');
    dictionaryConfigItem.getSourceUrlFromLevel(0).should('be.disabled');
    dictionaryConfigItem.getSourceUrlFromLevel(1).should('be.disabled');
  });

  it('switches dictionary in edit mode', () => {
    dictionaryConfigView.getEditDictButton().click();
    dictionaryConfigItem.getSourceUrlFromLevel(0).should('be.enabled');
    dictionaryConfigItem.getSourceUrlFromLevel(1).should('be.enabled');
  });

  it('removes dictionary', () => {
    const newListListener = DictionaryInterceptor.getNewList();
    dictionaryConfigView.getRemoveDictButton().click();
    confirmOperation()
      .wait(newListListener)
      .wait(500)
      .then(() => {
        dictionaryPage.getFirstTableRow().find('td:nth-of-type(1)').should('not.contain.text', dictionary.name);
      });
  });
});
});
