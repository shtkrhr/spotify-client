import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable()
export class CallbackResolver implements Resolve<any> {

  constructor(private router: Router,
              private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const params = new URLSearchParams(route.fragment);
    if (route.queryParams.hasOwnProperty('error')) {
      this.auth.clearToken();
    } else if (params.has('access_token')) {
      this.auth.saveToken(params.get('access_token'));
    }

    return this.router.navigate(['/']);
  }
}
