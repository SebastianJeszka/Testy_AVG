import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { NgxIbeAuthService } from '@ngx-ibe/core/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: NgxIbeAuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuth$;
  }
}
