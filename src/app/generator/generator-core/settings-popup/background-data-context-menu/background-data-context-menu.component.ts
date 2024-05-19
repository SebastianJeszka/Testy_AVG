import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BackgroundDataContextMenuItem } from 'src/app/_shared/models/sending-results.model';
@Component({
  selector: 'background-data-context-menu',
  templateUrl: './background-data-context-menu.component.html',
  styleUrls: ['./background-data-context-menu.component.scss']
})
export class BackgroundDataContextMenuComponent {
  hoverIndex: number;
  aciveKey = '';
  @Input() contextMenuItems: BackgroundDataContextMenuItem[] = [];
  @Output() contextMenuItemClick: EventEmitter<any> = new EventEmitter<any>();

  onContextMenuClick($event): any {
    this.contextMenuItemClick.emit($event);
  }

  enterFirst(i) {
    this.hoverIndex = i;
  }

  enterSecond(key) {
    this.aciveKey = key;
  }
}
