import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DictionaryExternalConfig } from '../models/dictionary-external-config.model';
import { DictionaryLevelData } from '../models/dictionary.model';

@Injectable({
  providedIn: 'root'
})
export class DictionaryConfigService {
  private readonly DICTIONARY_EXTERNAL_URL = '/api/form-generator/dictionary/external';

  // TODO: change to private
  dataChange = new BehaviorSubject<DictionaryExternalConfig>(new DictionaryExternalConfig());

  dictionaryLevelsDataChange = new BehaviorSubject<DictionaryLevelData[]>([]);

  get data(): DictionaryExternalConfig {
    return this.dataChange.value;
  }

  get dictionaryLevelsData(): DictionaryLevelData[] {
    return this.dictionaryLevelsDataChange.value;
  }

  constructor(private http: HttpClient) {}

  getExternalApiFields(externalApiUrl: string): Observable<Object> {
    return this.http.post(`${this.DICTIONARY_EXTERNAL_URL}/fields`, externalApiUrl);
  }

  getOptionsFromExternalApi(
    url: string,
    labelPropertyName: string,
    valuePropertyName: string,
    paramPropertyName: string
  ): Observable<Object> {
    return this.http.post(this.DICTIONARY_EXTERNAL_URL, {
      url,
      labelPropertyName,
      valuePropertyName,
      paramPropertyName
    });
  }
}
