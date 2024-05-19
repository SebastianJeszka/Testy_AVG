import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'mc-accordion',
  templateUrl: './mc-accordion.component.html',
  styleUrls: ['./mc-accordion.component.scss']
})
export class McAccordionComponent implements OnInit {
  @Input() title: string = 'Tytuł accordiona';
  @Input() dataTestIdContext: string = 'DefaultDataTestIdContext';
  @Input() isOpen: boolean;
  @Output() updateIsOpenInParent: EventEmitter<boolean> = new EventEmitter<boolean>();

  dataTestIdValue: string;
  dataTestIdSummary: string;
  dataTestIdTitle: string;

  ngOnInit(): void {
    this.dataTestIdValue = `accordionComponentDetails${this.dataTestIdContext}`;
    this.dataTestIdSummary = `accordionComponentSummary${this.dataTestIdContext}`;
    this.dataTestIdTitle = `accordionComponentHeader${this.dataTestIdContext}`;
  }

  toggleClickSummary(event) {
    this.isOpen !== undefined && event.preventDefault();
    this.updateIsOpenInParent.emit(!this.isOpen);
  }
}
