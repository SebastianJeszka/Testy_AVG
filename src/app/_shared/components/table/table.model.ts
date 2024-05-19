import { PageEvent } from '../paginator/paginator.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

export enum TableHeaderType {
  TEXT = 'TEXT',
  DATE = 'DATE',
  TEMPLATE = 'TEMPLATE',
  HTML = 'HTML'
}

export class TableHeader {
  name: string;
  display?: string;
  headerIcon?: string;
  headerStyle?: string;
  style?: string;
  type?: TableHeaderType;
  dateFormat?: string;
  hideColumn?: Observable<boolean>;
  hideCondition?: (value?) => boolean;
  clickable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  sortable?: boolean;
  filterable?: boolean;
  children?: boolean;
  sortMethod?: (a, b, sortDirection) => number;
}

export class TableOptions {
  restHandling?: boolean;
  pagination?: boolean;
  pageSizeOptions?: number[];
  filter?: boolean;
  showCount?: boolean;
  filterLabel?: string;
  filterPlaceholder?: string;
  defaultColumnSorting?: string;
  clickable?: boolean = false;
}

export class SortColumn {
  name: string;
  direction: SortDirection;
  method?: (a, b, sortDirection) => number;
}

export enum SortDirection {
  DESC = 'DESC',
  ASC = 'ASC'
}

export class TableEvent {
  page?: PageEvent;
  sort?: SortColumn;
  filter: string;
}

// necessary to use this module in non angular project
@Injectable({
  providedIn: 'root'
})
export class TableServiceOptions {
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [10, 25, 50];
}
