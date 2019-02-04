import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { getAccessToken } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanLoad {

  constructor(private router: Router) {}

  canLoad() {
    if (getAccessToken()) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
