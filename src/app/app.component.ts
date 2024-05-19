import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgxIbeContextService } from '@ngx-ibe/core/context';
import { NgxIbeAuthService } from '@ngx-ibe/core/auth';
import { NgxIbeAuthPeriodicConfirmation } from '@ngx-ibe/core/auth-periodic-confirmation';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isAuth$ = this.authService.isAuth$;
  isContextSelected$ = this.contextService.isContextSelected$;
  isLoggedOut = false;

  private unsubscribe$ = new Subject<void>();

  constructor(private authService: NgxIbeAuthService, private contextService: NgxIbeContextService) {}

  ngOnInit() {
    if (environment.showDemoModeInfo) {
      const element = document.getElementsByTagName('html')[0];
      element.classList.add('demoMode');
    }
    new NgxIbeAuthPeriodicConfirmation(this.authService).pipe(takeUntil(this.unsubscribe$)).subscribe();

    this.authService.isAuth$.pipe(takeUntil(this.unsubscribe$)).subscribe((isAuth) => {
      if (!isAuth) {
        this.unsubscribeAll();
      }
    });
  }

  logout() {
    this.authService.logOut().subscribe({
      complete: () => {
        this.isLoggedOut = true;
        environment.production ? (window.location.href = 'http://edukacja.gov.pl/') : location.reload();
      }
    });
  }

  changeContext() {
    this.contextService.unsetContext();
  }

  private unsubscribeAll() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
