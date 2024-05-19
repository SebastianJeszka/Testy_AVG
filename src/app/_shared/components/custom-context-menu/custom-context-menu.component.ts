import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomContextMenuItem } from 'src/app/_shared/models/custom-context-menu.model';

@Component({
  selector: 'custom-context-menu',
  templateUrl: './custom-context-menu.component.html',
  styleUrls: ['./custom-context-menu.component.scss']
})
export class ContextMenuContainerComponent {
  @Input() contextMenuItems: CustomContextMenuItem<string>[];
  @Input() openActionEvent: MouseEvent;
  @Output() contextMenuOutputEvent: EventEmitter<string> = new EventEmitter<string>();

  clickAction(emitValue: string) {
    this.contextMenuOutputEvent.emit(emitValue);
  }
}
