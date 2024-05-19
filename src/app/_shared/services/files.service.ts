import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  constructor(private http: HttpClient) {}

  private readonly FORM_URL = '/api/form-generator/forms';

  downloadFile(id: string) {
    return this.http.get(`${this.FORM_URL}/versions/answers/files/${id}`, {
      responseType: 'arraybuffer'
    });
  }

  uploadConsent(data: FormData) {
    return this.http.post(`${this.FORM_URL}/versions/settings/consent/upload`, data, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
