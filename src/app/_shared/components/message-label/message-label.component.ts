import { Component, Input } from '@angular/core';

export enum MessageLabelIcon {
  Info = 'info',
  Question = 'context-help',
  Warning = 'alert',
  Success = 'success'
}

@Component({
  selector: 'message-label',
  templateUrl: './message-label.component.html',
  styleUrls: ['./message-label.component.scss']
})
export class MessageLabelComponent {
  @Input() icon: MessageLabelIcon = MessageLabelIcon.Info;
}
