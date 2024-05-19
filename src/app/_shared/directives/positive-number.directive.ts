import { Directive, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[positiveNumbers]'
})
export class PositiveNumbersDirective implements AfterViewInit, OnDestroy {
  private input: HTMLInputElement;
  private keyPressSubscription: Subscription;

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    this.input = this.element.nativeElement.querySelector('input');

    if (this.input) {
      if (!this.input.min) {
        this.input.setAttribute('min', '0');
      }

      this.keyPressSubscription = fromEvent(this.input, 'keypress').subscribe((event: KeyboardEvent) => {
        if (event.code === 'Minus' || event.code === 'KeyE') {
          event.preventDefault();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.keyPressSubscription) {
      this.keyPressSubscription.unsubscribe();
    }
  }
}
