import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  event$ = new Subject();

  pushEvent(action) {
    this.event$.next(action);
  }
}
