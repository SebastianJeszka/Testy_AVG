import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { FileUploadData } from '../models/file-response.model';
import { FormSettings, RemoveData } from '../models/form-settings.model';
import { FormVersionBase, FormVersionFull } from '../models/form-version.model';

@Injectable({
  providedIn: 'root'
})
export class FormSettingsService {
  settingsChanged: Subject<FormSettings> = new Subject<FormSettings>();

  constructor(private http: HttpClient) {}

  private readonly FORM_URL = '/api/form-generator/forms';

  setSettings(settings: FormSettings, formVersion: FormVersionFull | FormVersionBase) {
    return this.http.put(`${this.FORM_URL}/${formVersion.formId}/versions/${formVersion.id}/settings`, settings);
  }

  getSettings(formVersion: FormVersionFull | FormVersionBase) {
    return this.http.get(`${this.FORM_URL}/${formVersion.formId}/versions/${formVersion.id}/settings`).pipe(
      map((settings: FormSettings) => {
        if (!settings.removeData) {
          settings.removeData = new RemoveData();
        }

        return settings;
      })
    );
  }

  uploadBackground(data: FileUploadData) {
    return this.http.post(`${this.FORM_URL}/versions/settings/background/upload`, data);
  }
}
