import { Injectable } from '@angular/core';
import { Dictionary } from '../models/dictionary.model';
import { Observable, map } from 'rxjs';
import { List } from '../models/list.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DictionariesService {
  private readonly DICTIONARY_URL = '/api/form-generator/dictionary';
  public dictionaries: Dictionary[] = [];

  constructor(private http: HttpClient) {}

  getList(): Observable<List<Dictionary>> {
    return this.http.get(this.DICTIONARY_URL).pipe(
      map((items: Dictionary[]) => {
        const list = new List<Dictionary>(items.length, items);
        return list as List<Dictionary>;
      })
    );
  }

  getOneDictionary(id: string): Observable<Dictionary> {
    return this.http.get<Dictionary>(`${this.DICTIONARY_URL}/by-id/${id}`);
  }

  addDictionary(item: Dictionary) {
    item.createDate = new Date();
    return this.http.post(this.DICTIONARY_URL, item);
  }

  removeDictionary(removeItem: Dictionary) {
    return this.http.delete(this.DICTIONARY_URL + `/${removeItem.id}`);
  }

  updateDictionary(dictionary: Dictionary) {
    return this.http.put(this.DICTIONARY_URL + `/${dictionary.id}`, dictionary);
  }
}
