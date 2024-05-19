import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Teryt } from 'src/app/_shared/models/teryt.model';

@Injectable({
  providedIn: 'root'
})
export class TerytAPIService {
  constructor(private http: HttpClient) {}

  getVoivodeship(): Observable<Teryt> {
    return this.http.get<Teryt>(`${environment.terytApiUrl}/terc/voivodeships`);
  }

  getDistrict(voivodeId: string): Observable<Teryt> {
    return this.http.get<Teryt>(`${environment.terytApiUrl}/terc/voivodeships/${voivodeId}/districts`);
  }

  getCommunes(voivodeId: string, districtsId: string): Observable<Teryt> {
    return this.http.get<Teryt>(
      `${environment.terytApiUrl}/terc/voivodeships/${voivodeId}/districts/${districtsId}/communes`,
      {
        params: {
          simc: 'true'
        }
      }
    );
  }

  getCities(voivodeId: string, districtsId: string, communityId: string): Observable<Teryt> {
    return this.http.get<Teryt>(
      `${environment.terytApiUrl}/simc/voivodeships/${voivodeId}/district/${districtsId}/communes/${communityId}/cities`
    );
  }

  getStreets(symbol: string): Observable<Teryt> {
    return this.http.get<Teryt>(`${environment.terytApiUrl}/ulic/${symbol}`);
  }
}
