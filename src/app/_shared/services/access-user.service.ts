import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, delay, first, map } from 'rxjs';
import { RegistrationFormUser, RegistrationFormUserState } from '../models/access-user.model';
import { Form } from '../models/form.model';
import { List } from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class AccessUserService {
  private readonly SERVICE_USERS_URL = '/api/form-generator/forms/service-users';

  constructor(private http: HttpClient) {}

  getRegistrationFormsList(): Observable<List<Form>> {
    return this.http.get(`/api/form-generator/forms/registration-forms`).pipe(
      map((r: Form[]) => {
        return new List<Form>(r.length, r);
      })
    );
  }

  getRegistrationFormsUser(serviceFormId: string, registerFormId: string): Observable<List<RegistrationFormUser>> {
    return this.http.get(`${this.SERVICE_USERS_URL}/${serviceFormId}/${registerFormId}`).pipe(
      map((r: RegistrationFormUser[]) => {
        return new List<RegistrationFormUser>(r.length, r);
      })
    );
  }

  setRegistrationUserState(userId: string, state: RegistrationFormUserState) {
    return this.http.put(`${this.SERVICE_USERS_URL}/change-state/${userId}?state=${state}`, null);
  }
}
