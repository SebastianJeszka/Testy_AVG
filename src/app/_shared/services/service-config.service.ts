import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServiceConfig, ServiceConfigVersion } from '../models/service-config.model';
import { ServiceCharter } from '../models/service-charter.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceConfigService {
  constructor(private http: HttpClient) {}

  getServiceConfigs(): Observable<ServiceConfig[]> {
    return this.http.get<ServiceConfig[]>(`/api/service-management/services`);
  }

  getServiceCharters(): Observable<ServiceCharter[]> {
    return this.http.get<ServiceCharter[]>(`/api/service-charter-catalog/charters/published-charters`);
  }

  getServiceConfigVersion(serviceId: string) {
    return this.http.get<ServiceConfigVersion[]>(`/api/service-management/services/${serviceId}/service-versions`);
  }
}
