import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormVersionFull } from '../models/form-version.model';
import { Observable } from 'rxjs/internal/Observable';
import { RecipientListItem } from '../models/sending-results.model';

@Injectable({
  providedIn: 'root'
})
export class ReportConfigService {
  private readonly URL_PREFIX = '/api/form-generator/forms';

  constructor(private http: HttpClient) {}

  getReportsConfig(formVersion: FormVersionFull) {
    return this.http.get(`${this.URL_PREFIX}/${formVersion.formId}/versions/${formVersion.id}/answers-report/config`);
  }

  putReportsConfig(formVersion: FormVersionFull, body) {
    return this.http.put(
      `${this.URL_PREFIX}/${formVersion.formId}/versions/${formVersion.id}/answers-report/config`,
      body
    );
  }

  enableConfig(formVersion: FormVersionFull) {
    return this.http.put(
      `${this.URL_PREFIX}/${formVersion.formId}/versions/${formVersion.id}/answers-report/config/enable`,
      {
        formId: formVersion.formId,
        formVersionId: formVersion.id
      }
    );
  }

  disableConfig(formVersion: FormVersionFull) {
    return this.http.put(
      `${this.URL_PREFIX}/${formVersion.formId}/versions/${formVersion.id}/answers-report/config/disable`,
      {
        formId: formVersion.formId,
        formVersionId: formVersion.id
      }
    );
  }

  getRecipientsList(): Observable<RecipientListItem[]> {
    return this.http.get<RecipientListItem[]>(`/api/form-generator/registered-external-api`);
  }
}
