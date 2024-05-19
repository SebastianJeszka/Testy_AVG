import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Branch } from 'src/app/_shared/components/tree/branch.model';

interface DictionaryTreeItemAddEvent {
  title: string;
  parent: Branch;
}

@Component({
  selector: 'dictionary-tree-item',
  templateUrl: './dictionary-tree-item.component.html',
  styleUrls: ['./dictionary-tree-item.component.scss']
})
export class DictionaryTreeItemComponent {
  @Input() data: Branch;
  @Output() add: EventEmitter<DictionaryTreeItemAddEvent> = new EventEmitter();
  @Output() remove: EventEmitter<Branch> = new EventEmitter();

  showActions: boolean = false;
  addNewChild: boolean = false;

  toggleActions() {
    this.showActions = !this.showActions;
    this.addNewChild = false;
  }

  toggleAddNewChild() {
    this.addNewChild = !this.addNewChild;
  }

  onAddNewDictionary(title: string) {
    if (title) {
      this.data.active = true;
      this.add.emit({
        parent: this.data,
        title
      });
      this.toggleActions();
    }
  }

  removeItem() {
    this.remove.emit(this.data);
  }
}
