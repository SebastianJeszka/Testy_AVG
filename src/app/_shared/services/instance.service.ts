import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IsaInstance } from 'src/app/auth/auth.component';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  constructor(private http: HttpClient) {}

  getIsaInstances(): Observable<IsaInstance[]> {
    return this.http.get<IsaInstance[]>(`/api/form-generator/isa-instances`);
  }
}
