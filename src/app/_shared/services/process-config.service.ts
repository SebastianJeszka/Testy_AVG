import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { GraphNode } from '../models/graph-node.model';
import {
  AppProcess,
  BackgroundDataMap,
  ProcessAutocompleteMapItem,
  ProcessResponseMap,
  ProcessType,
  ProcessTypeLabels
} from '../models/process-of-node.model';
import { QuestionField } from '../models/question-field.model';
import { FormService } from './form.service';
import { EXTERNAL_DATA_REQUEST_FLOW } from '../interceptors/redirect.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ProcessConfigService {
  private readonly PROCESSES_URL = '/api/form-generator/processes';

  responseMap: { [key: string]: { [key: string]: string } } = {
    LOGIN: {
      family_name: 'Nazwisko',
      given_name: 'Imię',
      pesel: 'Pesel',
      email: 'Adres e-mail'
    }
  };

  backgroundProcessesDataSufixMap: BackgroundDataMap[] = [
    {
      processName: 'Logowanie',
      processType: ProcessType.LOGIN,
      propNames: [
        'login_email',
        'login_family_name',
        'login_given_name',
        'login_name',
        'login_pesel',
        'login_preferred_username'
      ]
    },
    {
      processName: 'Rejestracja użytkowników',
      processType: ProcessType.USER_REGISTRATION,
      propNames: [
        'userRegister_confirmationType',
        'userRegister_name',
        'userRegister_surname',
        'userRegister_email',
        'userRegister_pesel',
        'userRegister_serviceFormId'
      ]
    },
    {
      processName: 'Zewnętrzne dane',
      processType: ProcessType.EXTERNAL_DATA,
      propNames: ['external_mappingResponseTarget']
    },
    {
      processName: 'Konfiguracja rejestru (GOV)',
      processType: ProcessType.DEFINE_GOV_REGISTER,
      propNames: ['answerRegisterConfiguration-registerId', 'answerRegisterConfiguration-articleTitleIdentifier']
    },
    {
      processName: `Obsługa ticket'ów`,
      processType: ProcessType.TICKET_VERIFICATION,
      propNames: ['answerRegisterConfiguration-registerId', 'answerRegisterConfiguration-articleTitleIdentifier']
    },
    {
      processName: 'Definicja e-maili',
      processType: ProcessType.DEFINE_EMAILS,
      propNames: ['emailsDefineMessage', 'emailsFieldsDefineMessage']
    },
    {
      processName: 'Podpisanie dokumentu',
      processType: ProcessType.SIGNING_DOC,
      propNames: ['redirectUrl', 'answersId']
    }
  ];

  constructor(private http: HttpClient, private formService: FormService) {}

  loadAllRespsMaps() {
    if (this.responseMap) {
      return of(this.responseMap);
    }

    return this.http.get<{ [key: string]: { [key: string]: string } }>(`${this.PROCESSES_URL}/responses`).pipe(
      map((r) => {
        this.responseMap = r;
        return r;
      })
    );
  }

  getAllRespMaps() {
    return this.responseMap;
  }

  getPocessResponseMap(procType: ProcessType): Observable<ProcessResponseMap> {
    return this.http.get<ProcessResponseMap>(`${this.PROCESSES_URL}/${procType}/response`);
  }

  changeResponseMapConfig(procType: ProcessType, configMap: any) {
    return this.http.put(`${this.PROCESSES_URL}/${procType}/response`, configMap);
  }

  getInfoOfConnectionToAutoComplete(fieldToCheck: QuestionField) {
    let _tempProcessTypeAndPropertyToAutocomplete = null;
    if (this.formService.currentFormVersion?.flow?.nodes) {
      this.formService.currentFormVersion.flow.nodes.forEach((node: GraphNode) => {
        const ifAfterProcessOfNodeInfo = this.checkIfFieldConnectedToAutocompleteInProcess(
          node?.data?.processes?.afterProcess,
          fieldToCheck
        );
        const ifBeforeProcessOfNodeInfo = this.checkIfFieldConnectedToAutocompleteInProcess(
          node?.data?.processes?.beforeProcess,
          fieldToCheck
        );
        if (ifAfterProcessOfNodeInfo) _tempProcessTypeAndPropertyToAutocomplete = ifAfterProcessOfNodeInfo;
        if (ifBeforeProcessOfNodeInfo) _tempProcessTypeAndPropertyToAutocomplete = ifBeforeProcessOfNodeInfo;
      });
    }
    return _tempProcessTypeAndPropertyToAutocomplete;
  }

  checkIfFieldConnectedToAutocompleteInProcess(process: AppProcess, fieldToCheck: QuestionField) {
    const getMapItemThatHasField = (map: ProcessAutocompleteMapItem[]) =>
      map.find((item: ProcessAutocompleteMapItem) => item.fieldId === fieldToCheck.id);
    let result = null;
    if (process?.autocompleteMap?.length > 0) {
      let mapItem: ProcessAutocompleteMapItem = getMapItemThatHasField(process?.autocompleteMap);
      if (mapItem) {
        let propertyFromResp = this.getAllRespMaps()[process.type][mapItem.responseProperty];
        let procType = ProcessTypeLabels[process.type];
        result = `proces: ${procType}, pole: ${propertyFromResp}`;
      }
    }
    return result;
  }

  testExternalRequest(url: string, testValuesArray: string[]): any {
    const context = new HttpContext();
    //TODO - INTEGRATE WITH CORE INTERCEPTOR FEATURE
    context.set(EXTERNAL_DATA_REQUEST_FLOW, true);
    const regex = /{.*?\}/g;
    const requestUrl = url.replace(regex, () => testValuesArray.shift());
    return this.http.get<any>(requestUrl, {
      context
    });
  }
}
