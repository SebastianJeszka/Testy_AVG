import { Directive, ElementRef, Renderer2, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';

const DEFAULT_PLACEMENT = 'button[type="submit"]';
const DEFAULT_ERROR_MESSAGE = 'Wystąpił błąd';
const DEFAULT_SUCCESS_MESSAGE = 'Akcja zakończona powodzeniem';

const HTTP_ERROR_EVENT = 'http-error';
const SUCCESS_EVENT = '[EVENT] Success';
const ERROR_EVENT = '[EVENT] Error';

@Directive({
  selector: '[mcAlert]'
})
export class AlertDirective implements OnDestroy, AfterViewInit {
  @Input('mcAlert') selectorOfElementInsertBefore;
  @Input() set mcAlertClose(value) {
    this.showCloseButton = value === '' ? true : value;
  }

  constructor(private el: ElementRef, private renderer: Renderer2, private eventService: EventService) {}

  alert: HTMLElement;
  showCloseButton: boolean = false;
  eventSubscription: Subscription;

  ngAfterViewInit(): void {
    this.eventSubscription = this.eventService.event$.subscribe((event: any) => {
      if (event.name === HTTP_ERROR_EVENT) {
        this.insertAlert(this.getHttpErrorMessage(event));
      } else if (event.name === SUCCESS_EVENT) {
        const message = event.message || DEFAULT_SUCCESS_MESSAGE;
        this.insertAlert(message, false);
      } else if (event.name === ERROR_EVENT) {
        const message = event.message || DEFAULT_ERROR_MESSAGE;
        this.insertAlert(message);
      }
    });
  }

  insertAlert(message, error: boolean = true) {
    setTimeout(() => {
      this.removeAlert();
      this.alert = this.renderer.createElement('div');
      const text = this.renderer.createText(message);
      this.alert.className = 'alert text-left' + (error ? ' alert-danger' : ' alert-success');
      this.renderer.appendChild(this.alert, text);
      if (this.showCloseButton) {
        this.alert.className += ' alert-dismissible';
        this.insertCloseButton(this.alert);
      }
      const elementToInsertBefore = this.el.nativeElement.querySelector(
        this.selectorOfElementInsertBefore || DEFAULT_PLACEMENT
      );
      if (elementToInsertBefore && elementToInsertBefore.parentElement) {
        if (this.selectorOfElementInsertBefore) {
          this.renderer.insertBefore(elementToInsertBefore.parentElement, this.alert, elementToInsertBefore);
        } else {
          this.renderer.insertBefore(
            elementToInsertBefore.parentElement,
            this.alert,
            elementToInsertBefore.parentElement.firstChild
          );
        }
      }
    });
  }

  insertCloseButton(div) {
    const button = this.renderer.createElement('button');
    this.renderer.addClass(button, 'close');
    this.renderer.setAttribute(button, 'type', 'button');
    this.renderer.setAttribute(button, 'data-dismiss', 'alert');
    this.renderer.setAttribute(button, 'aria-label', 'Zamknij');
    button.innerHTML = '<span aria-hidden="true">×</span>';
    this.renderer.appendChild(div, button);
    this.renderer.listen(button, 'click', (event) => {
      this.renderer.removeChild(this.el.nativeElement, div);
    });
  }

  removeAlert() {
    if (this.alert) {
      this.renderer.removeChild(this.el.nativeElement, this.alert);
    }
  }

  getHttpErrorMessage(event): string {
    let message = 'Wystąpił błąd';
    if (event.payload && event.payload.error && event.payload.error.message) {
      message = event.payload.error.message;
    } else if (event.payload && event.payload.message) {
      message = event.payload.message;
    }
    return message;
  }
  ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
