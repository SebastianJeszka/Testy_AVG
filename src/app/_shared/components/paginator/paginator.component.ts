import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableOptionsService } from '../table/table-options.service';

export class PageEvent {
  pageIndex: number;
  previousPageIndex?: number;
  pageSize: number;
  length: number;
}

@Component({
  selector: 'mc-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @ViewChild('pageInput') pageInput: ElementRef;
  @Input() disabled: boolean = false;
  @Input() pageIndex: number = 0;
  @Input() pageSize: number;
  @Input() set pageSizeOptions(pageSizeOptions: number[]) {
    this._pageSizeOptions = pageSizeOptions;
  }
  get pageSizeOptions() {
    return this._pageSizeOptions || this.tableOptionsService.options.pageSizeOptions;
  }
  private _pageSizeOptions: number[];

  private _length: number = 0;

  @Input() set length(length: number) {
    setTimeout(() => {
      this.emitPageEvent(0);
    });
    this._length = length;
  }

  get length() {
    return this._length;
  }

  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  constructor(private tableOptionsService: TableOptionsService) {}

  ngOnInit() {
    this.updateDisplayedPageSizeOptions();
  }

  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    this.pageIndex++;
    this.emitPageEvent(previousPageIndex);
  }

  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    this.pageIndex--;
    this.emitPageEvent(previousPageIndex);
  }

  lastPage(): void {
    if (!this.hasNextPage()) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.getNumberOfPages() - 1;
    this.emitPageEvent(previousPageIndex);
  }

  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize != 0;
  }

  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }

  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }
    return Math.ceil(this.length / this.pageSize);
  }

  changePageSize(pageSize: number) {
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;

    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this.emitPageEvent(previousPageIndex);
  }

  nextButtonsDisabled() {
    return this.disabled || !this.hasNextPage();
  }

  previousButtonsDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }

  private updateDisplayedPageSizeOptions() {
    if (!this.pageSize) {
      this.pageSize = this.pageSizeOptions[0] || this.tableOptionsService.options.pageSize;
    }
  }

  private emitPageEvent(previousPageIndex: number) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length
    });
  }

  enterPage(input) {
    const value = parseInt(input, 10);
    if (!isNaN(value) && value.toString() === input && value > 0 && value <= this.getNumberOfPages()) {
      const previousPageIndex = this.pageIndex;
      this.pageIndex = value - 1;
      this.emitPageEvent(previousPageIndex);
    } else {
      this.pageInput.nativeElement.value = this.pageIndex + 1;
    }
  }
}
