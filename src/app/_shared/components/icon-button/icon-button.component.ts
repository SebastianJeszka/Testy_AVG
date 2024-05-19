import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonComponent {
  @Input() icon: string = 'add';
  @Input() disabled: boolean = false;
  @Input() iconStyle: 'fill' | 'outline' = 'fill';
  @Input() iconSize: 'small' | 'normal' = 'normal';

  @Output() buttonClick: EventEmitter<void> = new EventEmitter();
}
