import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { FormVersionFull, FormVersionBase, FormVersionState } from '../models/form-version.model';
import { HttpClient } from '@angular/common/http';
import { List } from '../models/list.model';
import { AppGridsterItem, Tab } from '../models/tab.model';
import { QuestionField } from '../models/question-field.model';
import { Form, FormCategory } from '../models/form.model';
import { CustomContextMenuItem } from '../models/custom-context-menu.model';
import { AppProcess } from '../models/process-of-node.model';
import { ServiceConfig } from '../models/service-config.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  fieldsKey = 'webQuestFields';
  formVersions: FormVersionBase[];
  private _currentFormVersion: FormVersionFull = null;
  get currentFormVersion(): FormVersionFull {
    return this._currentFormVersion;
  }
  set currentFormVersion(v: FormVersionFull) {
    this._currentFormVersion = v;
  }

  private readonly FORM_URL = '/api/form-generator/forms';

  constructor(private http: HttpClient) {}

  getServiceConfigs(): Observable<ServiceConfig[]> {
    return this.http.get<ServiceConfig[]>(this.FORM_URL);
  }

  getFormsList(): Observable<List<Form>> {
    return this.http.get(this.FORM_URL).pipe(
      map((r: Form[]) => {
        return new List<Form>(r.length, r);
      })
    );
  }

  getTemplateChildList(formId: string): Observable<List<Form>> {
    return this.http.get(`${this.FORM_URL}/${formId}/children`).pipe(
      map((r: Form[]) => {
        return new List<Form>(r.length, r);
      })
    );
  }

  getFormVersion(formId: string, formVersionId: string): Observable<FormVersionFull> {
    return this.http
      .get(`${this.FORM_URL}/${formId}/versions/${formVersionId}`)
      .pipe(map(this.sortFormVersionTabs))
      .pipe(
        tap((r: FormVersionFull) => {
          this.currentFormVersion = r;
        })
      );
  }

  getLatestFormVersion(formId: string): Observable<FormVersionFull> {
    return this.getFormVersion(formId, 'current').pipe(map(this.sortFormVersionTabs));
  }

  getFormVersions(formId: string): Observable<FormVersionBase[]> {
    return this.http.get(`${this.FORM_URL}/${formId}/versions`).pipe(
      tap((formVersions: FormVersionBase[]) => (this.formVersions = formVersions)),
      map((formVersions: FormVersionBase[]) => formVersions.sort((a, b) => b.versionMajor - a.versionMajor))
    );
  }

  editFormVersion(formVersion: FormVersionFull) {
    return this.http
      .put(`${this.FORM_URL}/${formVersion.formId}/versions/${formVersion.id}`, formVersion)
      .pipe(map(this.sortFormVersionTabs));
  }

  exportFormVersion(formId: string, formVersionId?: string) {
    return this.http.get(
      `${this.FORM_URL}/${formId}/export`,
      formVersionId && {
        params: {
          formVersionId
        }
      }
    );
  }

  importFormConfig(configToImport: string, formName?: string) {
    return this.http.post(
      `${this.FORM_URL}/import`,
      configToImport,
      formName && {
        params: {
          formName
        }
      }
    );
  }

  removeForm(formId: string) {
    return this.http.post(`${this.FORM_URL}/delete`, null, {
      params: {
        formId
      }
    });
  }

  cloneForm(formId: string, formName: string) {
    return this.http.post(`${this.FORM_URL}/${formId}/clone`, null, {
      params: {
        formName
      }
    });
  }

  changeTab(formId: string, formCategory: FormCategory) {
    return this.http.post(`${this.FORM_URL}/${formId}/change-tab`, null, {
      params: {
        formId,
        formCategory
      }
    });
  }

  removeFormVersion(formVersion: FormVersionBase) {
    return this.http.delete(`${this.FORM_URL}/${formVersion.formId}/versions/${formVersion.id}`);
  }

  removeRelatedDataForm(formId: string, formVersionId: string) {
    return this.http.delete(`${this.FORM_URL}/${formId}/versions/${formVersionId}/answers`);
  }

  createForm(formVersion: FormVersionFull): Observable<FormVersionFull> {
    return this.http.post<FormVersionFull>(this.FORM_URL, formVersion);
  }

  createFormVersion(formVersion: FormVersionFull) {
    return this.http.post(`${this.FORM_URL}/${formVersion.formId}/versions`, {});
  }

  changeFormVersionState(formVersion: FormVersionBase, newState: FormVersionState) {
    const formData = new FormData();
    formData.append('state', newState);
    return this.http.put(`${this.FORM_URL}/${formVersion.formId}/versions/${formVersion.id}/change-state`, formData);
  }

  formToStorage(fields: FormVersionFull) {
    localStorage.setItem(this.fieldsKey, JSON.stringify(fields));
  }

  getFieldsFromStorage(): FormVersionFull {
    const fields: FormVersionFull = JSON.parse(localStorage.getItem(this.fieldsKey));
    return fields ? fields : null;
  }

  clearStorage() {
    localStorage.removeItem(this.fieldsKey);
  }

  removeTemporaryIds() {
    const removeFieldTempId = (q: AppGridsterItem) =>
      q.field.id && q.field.id.includes('temporary') ? (q.field.id = null) : null;

    this.currentFormVersion.tabs.forEach((tab: Tab) => {
      if (tab.id && tab.id.includes('temporary')) {
        tab.id = null;
      }

      tab.questions.forEach((question: AppGridsterItem) => {
        if (question.field.repeatingSectionGrid?.length) {
          question.field.repeatingSectionGrid.forEach((repSectionItem: AppGridsterItem) =>
            removeFieldTempId(repSectionItem)
          );
        }
        removeFieldTempId(question);
      });
    });

    this.currentFormVersion.flow.nodes.forEach((node) => {
      if (node.id && node.id.includes('temporary')) {
        node.id = null;
      }
    });
  }

  checkIfTabNameExist(name: string, activeIndex: number = -1) {
    return this.currentFormVersion.tabs.some(
      (tab: Tab) => (tab.orderIndex !== activeIndex && tab.title.toLocaleLowerCase()) === name.toLocaleLowerCase()
    );
  }

  checkIfEditionStateEnabledForForm(): boolean {
    return this.currentFormVersion?.state === FormVersionState.SKETCH;
  }

  isAllowedChangeTechName(questionField?: QuestionField) {
    return true;
  }

  getAvaliableTechNames() {
    return this.getAllFieldTechNames().concat(this.getAllProcessesTechNames());
  }

  getAllProcessesTechNames(): string[] {
    const processesTechNames: string[] = [];
    this.currentFormVersion.flow.nodes
      .filter((node) => node.data.processes.beforeProcess.techName || node.data.processes.afterProcess.techName)
      .forEach((node) =>
        processesTechNames.push(
          ...[node.data.processes.beforeProcess, node.data.processes.afterProcess]
            .filter((proc: AppProcess) => proc.enabled && proc.techName)
            .map((proc) => proc.techName)
        )
      );
    return processesTechNames;
  }

  getAllFieldTechNames(): string[] {
    const techNames: string[] = [];
    this.currentFormVersion.tabs.forEach((tab: Tab) =>
      techNames.push(...tab.questions.map((question) => question.field.techName))
    );
    return techNames;
  }

  getContextMenuItemsWithAllTechNames(): CustomContextMenuItem<string>[] {
    const contextMenuItems = [];

    if (this.currentFormVersion && this.currentFormVersion.tabs) {
      contextMenuItems.push({
        label: 'Nazwy techniczne pól',
        subItems: this.currentFormVersion.tabs
          .filter((tab) => tab.questions.length)
          .map((tab) => ({
            label: tab.title,
            subItems: tab.questions.map(({ field: { techName } }) => ({
              label: techName,
              emitValue: `{{${techName}}}`
            }))
          }))
      });
    }

    if (this.currentFormVersion && this.currentFormVersion.flow) {
      contextMenuItems.push({
        label: 'Nazwy techniczne procesów',
        subItems: this.currentFormVersion.flow.nodes
          .filter((node) => node.data.processes.beforeProcess.techName || node.data.processes.afterProcess.techName)
          .map((node) => ({
            label: this.getTabTitleByNodeId(node.id),
            subItems: [node.data.processes.beforeProcess, node.data.processes.afterProcess]
              .filter((proc: AppProcess) => proc.enabled && proc.techName)
              .map((process: AppProcess) => ({
                label: process.techName,
                emitValue: `{{${process.techName}}}`,
                processType: process.type
              }))
          }))
      });
    }

    return contextMenuItems.filter((rootMenuItem) => rootMenuItem.subItems?.length);
  }

  getTabTitleByNodeId(nodeId: string): string {
    return this.currentFormVersion.tabs.find((tab) => tab.id === nodeId).title;
  }

  getFieldsFlatten() {
    const fields: QuestionField[] = [];

    this.currentFormVersion.tabs.forEach((tab) => {
      tab.questions.forEach((question) => {
        fields.push(question.field);
      });
    });

    return fields;
  }

  getProcessesFlatten() {
    const processes: AppProcess[] = [];

    this.currentFormVersion?.flow?.nodes?.forEach((node) => {
      if (node.data?.processes?.afterProcess) {
        processes.push(node.data?.processes?.afterProcess);
      }

      if (node.data?.processes?.beforeProcess) {
        processes.push(node.data?.processes?.beforeProcess);
      }
    });

    return processes;
  }

  private sortFormVersionTabs(r: FormVersionFull) {
    r.tabs.sort((a, b) => a.orderIndex - b.orderIndex);
    return r;
  }

  getAllActiveProcessesTypes(): string[] {
    const processesTypes: string[] = [];
    this.currentFormVersion.flow.nodes
      .filter((node) => node.data.processes.beforeProcess.techName || node.data.processes.afterProcess.techName)
      .forEach((node) =>
        processesTypes.push(
          ...[node.data.processes.beforeProcess, node.data.processes.afterProcess]
            .filter((proc: AppProcess) => proc.enabled && proc.techName)
            .map((proc) => proc.type)
        )
      );
    return processesTypes;
  }

  getAllActiveProcesses(): AppProcess[] {
    const activePorcesses: AppProcess[] = [];
    this.currentFormVersion.flow.nodes
      .filter((node) => node.data.processes.beforeProcess.techName || node.data.processes.afterProcess.techName)
      .forEach((node) =>
        activePorcesses.push(
          ...[node.data.processes.beforeProcess, node.data.processes.afterProcess].filter(
            (proc: AppProcess) => proc.enabled && proc.techName
          )
        )
      );
    return activePorcesses;
  }

  externalApiRequest(requestUrl: string): any {
    return this.http.get<any>(requestUrl);
  }
}
