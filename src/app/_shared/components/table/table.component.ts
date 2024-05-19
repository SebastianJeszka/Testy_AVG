import {
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { ColumnDefinitionDirective } from './column-definition.directive';
import { PageEvent, PaginatorComponent } from '../paginator/paginator.component';
import { SortColumn, SortDirection, TableEvent, TableHeader, TableHeaderType, TableOptions } from './table.model';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { Form } from '../../models/form.model';

const DEFAULT_OPTIONS: TableOptions = {
  restHandling: false,
  pagination: true,
  filter: false,
  showCount: true,
  filterLabel: 'Znajdź:',
  filterPlaceholder: 'Wpisz czego szukasz'
};

const DEFAULT_DATE_FORMAT = 'dd-MM-yyyy';

export interface CellClickedEvent<T> {
  header: TableHeader;
  row: T;
  event: any;
}

export interface TableSettings {
  pageSize: number;
  sortColumnName: string;
  sortDirection: SortDirection;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnDestroy {
  @Input() set options(options: TableOptions) {
    this._options = options;
  }
  @Input() tableName: string;
  @Input() childrenRows: boolean = false;
  @Input() childrenData: Form[] = [];
  @Input() selectedRow: any;
  @Input() set headers(headers: TableHeader[]) {
    this._headers = headers;
  }
  @Input() set data(data: []) {
    this._data = data;
    this.initData();
  }
  @Input() count: number;
  @Input() activeChildRow = '';
  @Output() cellClicked = new EventEmitter<CellClickedEvent<any>>();
  @Output() tableChanged = new EventEmitter<TableEvent>();
  @Output() filterChanged = new EventEmitter<string>();

  _options: TableOptions = {};
  TableHeaderType = TableHeaderType;
  DEFAULT_DATE_FORMAT = DEFAULT_DATE_FORMAT;
  sortColumn: SortColumn;
  filter = '';
  filteredData = [];
  displayData = [];
  tableSetting: TableSettings;
  pageSize: number = 10;
  filterKeyUp = new Subject<KeyboardEvent>();
  loading: boolean = true;
  private filterSubscription: Subscription;
  private _data: [];
  private _headers: TableHeader[];

  @ContentChildren(ColumnDefinitionDirective) columnsDefinitions: QueryList<ColumnDefinitionDirective>;
  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  constructor() {
    this.filterSubscription = this.filterKeyUp
      .pipe(debounceTime(this.options.restHandling ? 400 : 0))
      .subscribe(() => this.filterData());
  }

  get headers(): TableHeader[] {
    return this._headers;
  }

  get data() {
    return this._data;
  }

  get dataLength(): number {
    return this.options.restHandling ? this.count : this.filteredData.length;
  }

  get options(): TableOptions {
    return { ...DEFAULT_OPTIONS, ...this._options };
  }

  @HostListener('window:beforeunload', ['$event'])
  saveSettings() {
    this.setTableSettings();
  }

  ngOnDestroy(): void {
    this.setTableSettings();
    this.filterSubscription.unsubscribe();
  }

  initData() {
    const defaultTableSettings = this.getTableSetting();
    if (this.options.defaultColumnSorting) {
      this.setInitialSorting();
    }

    if (this.data) {
      this.filteredData = this.data.slice();
      if (defaultTableSettings) {
        this.pageSize = defaultTableSettings?.pageSize ?? this.paginator?.pageSize;
      }

      this.displayData = this.options.pagination
        ? this.paginate(this.filteredData, this.pageSize, this.paginator?.pageIndex)
        : this.data.slice();
      this.sortByColumn();
      this.loading = false;
    }

    if (!defaultTableSettings) {
      this.setTableSettings();
    }
  }

  setInitialSorting(): void {
    const savedColumnDirection = this.getTableSetting()?.sortDirection;
    let sorting = savedColumnDirection ?? SortDirection.ASC;
    let columnName = this.getTableSetting()?.sortColumnName ?? this.options.defaultColumnSorting;
    if (columnName.startsWith('!')) {
      sorting = SortDirection.DESC;
      columnName = columnName.substring(1);
    }
    const header = this.headers.find((v) => v.name === columnName);
    if (header) {
      this.setSorting(header, sorting);
    }
  }

  clickRow(header: TableHeader, row, event) {
    if (this.options.clickable) {
      this.selectedRow = row;
    }
    this.cellClicked.emit({ header, row, event });
  }

  onChangePage(event: PageEvent): void {
    if (this.options.restHandling) {
      this.sendChangeEvent(event);
    } else {
      this.displayData = this.paginate(this.filteredData, event.pageSize, event.pageIndex);
    }
  }

  sendChangeEvent(event?: PageEvent) {
    this.loading = true;
    event = event
      ? event
      : {
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.paginator.length,
          previousPageIndex: this.paginator.pageIndex
        };
    this.tableChanged.emit({ page: event, filter: this.filter, sort: this.sortColumn });
  }

  paginate(array: any[], pageSize: number, pageNumber: number) {
    return array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
  }

  getTemplateForColumn(columnName: string) {
    return this.columnsDefinitions.find((header) => header.columnName === columnName)?.template;
  }

  changeSorting(header: TableHeader, direction: SortDirection) {
    if (this.sortColumn?.name === header.name) {
      this.sortColumn.direction =
        this.sortColumn.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    } else {
      this.sortColumn = { name: header.name, direction, method: header.sortMethod };
    }
    if (this.options.restHandling) {
      this.sendChangeEvent();
    } else {
      this.sortByColumn();
    }
  }

  setSorting(header: TableHeader, direction: SortDirection): void {
    this.sortColumn = { name: header.name, direction, method: header.sortMethod };
  }

  sortByColumn() {
    if (this.sortColumn) {
      this.filteredData = this.sort(this.filteredData, this.sortColumn);
    }
    if (this.paginator && this.options.pagination) {
      this.paginator.pageIndex = 0;
      this.displayData = this.paginate(this.filteredData, this.paginator.pageSize, this.paginator.pageIndex);
    } else {
      this.displayData = this.filteredData.slice();
    }
    this.setTableSettings();
  }

  sort(data: any[], sort: SortColumn) {
    return data.sort((firstObj, secondObj) => {
      if (sort.method) {
        return sort.method(firstObj, secondObj, sort.direction);
      }
      let firstValue = firstObj[sort.name];
      let secondValue = secondObj[sort.name];
      if (!firstValue || !secondValue) {
        return 0;
      }
      if (typeof firstValue === 'string') {
        return sort.direction === 'ASC' ? firstValue.localeCompare(secondValue) : secondValue.localeCompare(firstValue);
      } else {
        return sort.direction === 'ASC' ? (firstValue > secondValue ? 1 : -1) : firstValue > secondValue ? -1 : 1;
      }
    });
  }

  filterData() {
    if (this.options.restHandling) {
      this.sendChangeEvent();
    } else {
      this.filteredData = this.data.filter((row: any) =>
        this.headers
          .filter((header) => header.filterable)
          .map((header) => header.name)
          .some((key) => row[key]?.toString()?.toLowerCase()?.includes(this.filter?.toLowerCase()))
      );
      this.sortByColumn();
    }
    this.filterChanged.emit(this.filter);
  }

  clearFilter() {
    this.filter = '';
    this.filterData();
  }

  private setTableSettings(): void {
    if (this.tableName) {
      this.tableSetting = {
        sortColumnName: this.sortColumn?.name,
        sortDirection: this.sortColumn?.direction,
        pageSize: this.paginator?.pageSize
      };
      localStorage.setItem(this.tableName, JSON.stringify(this.tableSetting));
    }
  }

  private getTableSetting(): TableSettings | null {
    return this.tableName ? JSON.parse(localStorage.getItem(this.tableName)) : null;
  }
}
