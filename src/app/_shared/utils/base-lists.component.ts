import { MatSort, Sort } from '@angular/material/sort';
import { List, splitListForPages } from '../models/list.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface BaseMatListComponent {
  dataSource: MatTableDataSource<any>;
  paginator: MatPaginator;
  sort: MatSort;
}

export class BaseListsComponent<T> implements BaseMatListComponent {
  dataSource = new MatTableDataSource([]);

  paginator: MatPaginator; // ViewChild in child/extended component
  sort: MatSort; // ViewChild in child/extended component

  resultsLength = 0;
  lastPageSize = 10;
  lastSort: Sort = null;
  pages: { [key: number]: T[] } = null;
  originalList: List<T> = null;
  filteredList: List<T> = null;

  childSortFunc: Function;

  setPaginatorLabels() {
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = 'Pokaż na stronie';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} / ${length}`;
      };
      this.paginator._intl.changes.next();
    }
  }

  applyFilter(event: Event, filterFunc: Function) {
    const filterValue = (event.target as HTMLInputElement).value;
    let data = this.originalList?.items.slice();
    if (filterValue && filterValue.length > 1) {
      data = data.filter((quest: T) => filterFunc(filterValue, quest));
    }
    if (this.lastSort?.direction && this.childSortFunc) {
      data = data.sort((a: T, b: T) => this.childSortFunc(this.lastSort, a, b));
    }
    this.filteredList = new List(data.length, data);
    this.resultsLength = this.filteredList.count;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pages = splitListForPages(this.filteredList, this.lastPageSize);
    this.dataSource.data = this.filteredList.count > 0 ? data : [];
  }

  onMatSortChange(sort: Sort, sortFunc: Function) {
    let data = this.filteredList?.count ? this.filteredList?.items.slice() : this.originalList.items.slice();
    if (sort.active && sort.direction !== '' && sortFunc) {
      data = data.sort((a: T, b: T) => sortFunc(sort, a, b));
      this.childSortFunc = sortFunc;
    }
    this.lastSort = sort;
    this.filteredList = new List(data.length, data);
    this.pages = splitListForPages(this.filteredList, this.lastPageSize);
    this.dataSource.data = this.getPage(this.paginator.pageIndex);
  }

  onGetListSuccess(list: List<T>) {
    this.pages = splitListForPages(list, this.lastPageSize);
    this.originalList = list;
    this.resultsLength = list.count;
    this.dataSource.data = list.items;
  }

  getPage(pageIndex: number): any[] {
    return this.pages[pageIndex] || [];
  }

  onPageChanged(page: PageEvent) {
    let listForPage;
    if (this.lastPageSize !== page.pageSize) {
      this.lastPageSize = page.pageSize;
      this.pages = splitListForPages(this.originalList, this.lastPageSize);
      listForPage = this.getPage(0);
    } else {
      listForPage = this.getPage(page.pageIndex);
    }
    this.dataSource.data = listForPage;
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
