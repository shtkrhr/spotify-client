import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { logOut, saveAccessToken } from '../../../core/auth/auth';

@Injectable()
export class CallbackResolver implements Resolve<any> {

  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const params = new URLSearchParams(route.fragment);
    if (route.queryParams.hasOwnProperty('error')) {
      logOut();
    } else if (params.has('access_token')) {
      saveAccessToken(params.get('access_token'));
    }

    return this.router.navigate(['/']);
  }
}
