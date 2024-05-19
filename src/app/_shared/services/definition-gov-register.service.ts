import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GovRegisterService {
  constructor(private http: HttpClient) {}

  getRegisterColumns(registerId: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/form-generator/registers/columns/${registerId}`);
  }
}
