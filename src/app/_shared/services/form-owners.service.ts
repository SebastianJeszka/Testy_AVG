import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUser } from '../models/app-user.model';
import { NgxIbeContextService } from '@ngx-ibe/core/context';

@Injectable({
  providedIn: 'root'
})
export class FormOwnersService {
  private readonly USERS_URL = '/api/mgmt/subject-user/application';
  private readonly FORM_URL = '/api/form-generator/forms';

  constructor(private http: HttpClient, private contextService: NgxIbeContextService) {}

  getAppUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(
      `${this.USERS_URL}/${environment.appId}/business-unit/${this.contextService.selectedContext$}`
    );
  }

  changeOwner(formId: string, ownerId: string): Observable<any> {
    return this.http.put<any>(`${this.FORM_URL}/${formId}/owner/${ownerId}`, null);
  }
}
