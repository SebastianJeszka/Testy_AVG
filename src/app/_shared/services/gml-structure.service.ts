import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type GmlStructure = any;

@Injectable({
  providedIn: 'root'
})
export class GmlStructureService {
  constructor(private http: HttpClient) {}

  private readonly FORM_URL = '/api/form-generator/forms/validation/gml/structure';

  private _gmlStructure: GmlStructure;

  getGmlStrucutre(): Observable<GmlStructure> {
    return this.http.get(`${this.FORM_URL}`);
  }

  set gmlStructure(gmlStructure) {
    this._gmlStructure = gmlStructure;
  }

  get gmlStructure() {
    return this._gmlStructure;
  }
}
