import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dictionary-item-form',
  templateUrl: './dictionary-item-form.component.html',
  styleUrls: ['./dictionary-item-form.component.scss']
})
export class DictionaryItemFormComponent {
  name: string = '';

  @Output() save: EventEmitter<string> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  onSave() {
    this.save.emit(this.name);
  }

  onCancel() {
    this.cancel.emit();
  }
}
