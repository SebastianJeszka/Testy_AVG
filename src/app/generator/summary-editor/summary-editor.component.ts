import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular';
import { Observable } from 'rxjs';
import { ckeditorConfig } from 'src/app/_shared/models/ckeditor-config.model';
import { FieldTypes } from 'src/app/_shared/models/field-types.enum';
import { FormVersionFull } from 'src/app/_shared/models/form-version.model';
import { Tab } from 'src/app/_shared/models/tab.model';
import { FormService } from 'src/app/_shared/services/form.service';

type BaseField = {
  techName: string;
  title: string;
};

type Field = BaseField & {
  isRepeatingSection: boolean;
  repeatingSectionFields: BaseField[];
};

type TabWithFields = {
  tabName: string;
  fields: Field[];
};

@Component({
  selector: 'summary-editor',
  templateUrl: './summary-editor.component.html'
})
export class SummaryEditorComponent implements OnInit {
  private readonly REPEATING_SECTION_CLASS_NAME: string = 'repeatingSection';
  private readonly TECH_NAME_MENU_ITEM_GROUP: string = 'fieldTechNameGroup';
  private readonly CKEDITOR_ON_STATE: number = 2;

  isEdited: boolean = false;
  currentTabId: string = '';
  formId: string = '';
  private formVersionId: string = '';
  private formVersion: FormVersionFull = null;
  summaryHtmlTemplate: string = '';
  private tabsWithFields: TabWithFields[] = [];
  private menuItemOrder: number = 1;

  ckeditorConfig: CKEditor4.Config = ckeditorConfig({
    editorplaceholder: 'Wpisz zawartość podsumowania',
    height: 220,
    extraAllowedContent: `style;div[id](${this.REPEATING_SECTION_CLASS_NAME}){*}`
  });
  private ckeditor: CKEditor4.Editor;

  constructor(private formService: FormService, private activeRoute: ActivatedRoute) {}

  ngOnInit() {
    this.formId = this.activeRoute.snapshot.params['id'];
    this.formVersionId = this.activeRoute.snapshot.queryParams['formVersionId'];
    this.currentTabId = this.activeRoute.snapshot.queryParams['currentTabId'];

    this.initFormVersion();
  }

  private initFormVersion() {
    this.formService.getFormVersion(this.formId, this.formVersionId).subscribe((formVersion: FormVersionFull) => {
      this.formVersion = formVersion;
    });
  }

  onInstanceReady(event: { editor: CKEditor4.Editor }) {
    this.ckeditor = event.editor;
    this.initTabsWithFields();
    this.initCustomMenuItems();
  }

  private initTabsWithFields() {
    this.tabsWithFields = this.getTabsWithFields();
  }

  private initCustomMenuItems() {
    this.addCommands();
    this.addMenuItems();
  }

  private getTabsWithFields(): TabWithFields[] {
    return this.formVersion.tabs.map((tab: Tab) => ({
      tabName: tab.title,
      fields: tab.questions.map(({ field }) => ({
        techName: field.techName,
        title: field.title,
        isRepeatingSection: field.type === FieldTypes.REPEATING_SECTION,
        repeatingSectionFields: field.repeatingSectionGrid.length
          ? field.repeatingSectionGrid.map(({ field }) => ({
              techName: field.techName,
              title: field.title
            }))
          : []
      }))
    }));
  }

  private insertRepeatingSectionContent(repeatingSectionFields: BaseField[]): string {
    return `${repeatingSectionFields.map((field) => `{{${field.techName}}}`).join('<br/>')}`;
  }

  private insertRepeatingSectionElement(field: Field) {
    this.ckeditor.insertHtml(
      `<div id=${field.techName} class="${
        this.REPEATING_SECTION_CLASS_NAME
      }" style="border: 1px dashed gray">${this.insertRepeatingSectionContent(field.repeatingSectionFields)}</div>`
    );
  }

  private addCommands() {
    this.tabsWithFields.forEach((tabWithFields: TabWithFields) => {
      tabWithFields.fields.forEach((field: Field) => {
        this.ckeditor.addCommand(field.techName, {
          exec: () => {
            if (field.isRepeatingSection && field.repeatingSectionFields.length) {
              this.insertRepeatingSectionElement(field);
            } else {
              this.ckeditor.insertText(`{{${field.techName}}}`);
            }
          }
        });
      });
    });
  }

  private getTabNames() {
    return this.tabsWithFields.reduce((tabNamesConfig, currentTab) => {
      tabNamesConfig[currentTab.tabName] = this.CKEDITOR_ON_STATE;
      return tabNamesConfig;
    }, {});
  }

  private getFieldTechNamesFromTab(tabName: string) {
    return this.tabsWithFields
      .find((tabWithFields: TabWithFields) => tabWithFields.tabName === tabName)
      .fields.reduce((fieldTechNamesConfig, currentField) => {
        fieldTechNamesConfig[currentField.techName] = this.CKEDITOR_ON_STATE;
        return fieldTechNamesConfig;
      }, {});
  }

  private addFieldTechNameMenuItem(field: Field, order: number) {
    return {
      [field.techName]: {
        label: field.isRepeatingSection ? `${field.title} (sekcja powtarzająca się)` : field.title,
        group: this.TECH_NAME_MENU_ITEM_GROUP,
        command: field.techName,
        order
      }
    };
  }

  private addTabNameMenuItem(tabName: string, order: number) {
    return {
      [tabName]: {
        label: tabName,
        group: this.TECH_NAME_MENU_ITEM_GROUP,
        getItems: () => this.getFieldTechNamesFromTab(tabName),
        order
      }
    };
  }

  private addInsertTechNameMenuItem() {
    return {
      insertTechName: {
        label: 'Wstaw nazwę techniczą pola',
        group: this.TECH_NAME_MENU_ITEM_GROUP,
        getItems: () => this.getTabNames(),
        order: this.menuItemOrder++
      }
    };
  }

  private addTabNameMenuItems() {
    return this.tabsWithFields.reduce(
      (tabNameMenuItems, tabWithFields) => ({
        ...tabNameMenuItems,
        ...this.addTabNameMenuItem(tabWithFields.tabName, this.menuItemOrder++)
      }),
      {}
    );
  }

  private addFieldTechNameMenuItems() {
    return this.tabsWithFields.reduce(
      (fieldTechNameMenuItems, tabWithFields) => ({
        ...fieldTechNameMenuItems,
        ...tabWithFields.fields.reduce(
          (acc, field) => ({
            ...acc,
            ...this.addFieldTechNameMenuItem(field, this.menuItemOrder++)
          }),
          {}
        )
      }),
      {}
    );
  }

  private addMenuItems() {
    if (this.ckeditor.contextMenu) {
      this.ckeditor.addMenuGroup(this.TECH_NAME_MENU_ITEM_GROUP, 3);

      this.ckeditor.addMenuItems(
        Object.assign(
          {},
          this.addInsertTechNameMenuItem(),
          this.addTabNameMenuItems(),
          this.addFieldTechNameMenuItems()
        )
      );
    }

    this.ckeditor.contextMenu.addListener(() => ({
      insertTechName: this.CKEDITOR_ON_STATE
    }));
  }

  private removeLineBreaks(htmlTemplate: string) {
    return htmlTemplate.replace(/(\r\n|\n|\r)/gm, '');
  }

  onSummaryHtmlTemplateChange() {
    this.isEdited =
      this.removeLineBreaks(this.formVersion.summaryHtmlTemplate) !== this.removeLineBreaks(this.summaryHtmlTemplate);
  }

  saveSummaryDescription() {
    this.formVersion.summaryHtmlTemplate = this.summaryHtmlTemplate;
    this.formService.editFormVersion(this.formVersion).subscribe(() => {
      this.isEdited = false;
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.isEdited;
  }
}
