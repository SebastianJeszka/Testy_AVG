import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NgxIbeRolesService } from '@ngx-ibe/core/roles';

@Injectable()
export class ManageUsersGuard {
  constructor(private rolesService: NgxIbeRolesService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.rolesService.hasRole('ALLOW_USER_MANAGE').pipe(
      tap((role) => {
        if (!role) {
          this.router.navigate(['generator']);
        }
      }),
      catchError((err) => {
        this.router.navigate(['generator']);
        return of(false);
      })
    );
  }
}
