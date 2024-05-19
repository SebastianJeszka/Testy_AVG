import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GeneratorComponent } from 'src/app/generator/generator-core/generator.component';
import { Observable } from 'rxjs';

@Injectable()
export class DeactivateGeneratorGuard implements CanDeactivate<GeneratorComponent> {
  canDeactivate(
    component: GeneratorComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate()
      ? true
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        confirm(
          'UWAGA: Masz niezapisane zmiany. Naciśnij Anuluj, aby cofnąć się i zapisać te zmiany, lub OK, aby je utracić.'
        );
  }
}
