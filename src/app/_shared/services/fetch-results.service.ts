import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormVersionFull } from '../models/form-version.model';

@Injectable({
  providedIn: 'root'
})
export class FetchResultsService {
  constructor(private http: HttpClient) {}

  private readonly FORM_URL = '/api/form-generator/forms';

  fetchResults(formVersion: FormVersionFull, fromDate: string, toDate: string): Observable<any> {
    const params = {};
    if (fromDate) params['createDateStart'] = fromDate;
    if (toDate) params['createDateEnd'] = toDate;

    return this.http.get(`${this.FORM_URL}/${formVersion.formId}/versions/${formVersion.id}/answers`, {
      responseType: 'arraybuffer',
      params
    });
  }
}
