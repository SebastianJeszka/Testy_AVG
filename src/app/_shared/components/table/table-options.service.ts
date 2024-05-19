import { Injectable } from '@angular/core';
import { TableServiceOptions } from './table.model';

@Injectable({
  providedIn: 'root'
})
export class TableOptionsService {
  options: TableServiceOptions;

  constructor(options: TableServiceOptions) {
    this.options = options;
  }
}
