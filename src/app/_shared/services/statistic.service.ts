import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StatisticDataDto, StatisticFormDto, StatisticOptions } from '../models/statistic.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private readonly STATISTIC_URL = '/api/form-generator/statistics';

  constructor(private http: HttpClient) {}

  getStatisticFields(formVersionId: string): Observable<StatisticOptions[]> {
    return this.http.get<StatisticOptions[]>(`${this.STATISTIC_URL}`, {
      params: {
        formVersionId
      }
    });
  }

  getStatisticData(statisticForm: StatisticFormDto): Observable<StatisticDataDto[]> {
    return this.http.post<StatisticDataDto[]>(`${this.STATISTIC_URL}`, statisticForm);
  }
}
