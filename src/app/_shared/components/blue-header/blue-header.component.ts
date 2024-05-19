import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxIbeAuthService } from '@ngx-ibe/core/auth';
import { NgxIbeRolesService } from '@ngx-ibe/core/roles';

@Component({
  selector: 'blue-header',
  templateUrl: './blue-header.component.html',
  styleUrls: ['./blue-header.component.scss']
})
export class BlueHeaderComponent {
  allowUserManage$: Observable<boolean> = this.rolesService.hasRole('ALLOW_USER_MANAGE');
  constructor(public authService: NgxIbeAuthService, private rolesService: NgxIbeRolesService) {}
}
