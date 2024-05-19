import { Directive, ElementRef, Input } from '@angular/core';
import { AppGridsterItem } from '../models/tab.model';

@Directive({
  selector: '[appGridItem]'
})
export class GridItemDirective {
  @Input()
  set appGridItem(item: AppGridsterItem) {
    this.initGridRow(item);
    this.initGridColumn(item);
  }

  constructor(private element: ElementRef) {}

  initGridRow(item: AppGridsterItem): void {
    this.element.nativeElement.style['grid-row'] = `row ${item.y + 1} / span ${item.rows}`;
  }

  initGridColumn(item: AppGridsterItem): void {
    this.element.nativeElement.style['grid-column'] = `${item.x + 1} / span ${item.cols}`;
  }
}
