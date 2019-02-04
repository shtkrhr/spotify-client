import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanLoad {

  constructor(private router: Router, private auth: AuthService) {}

  canLoad() {
    if (!this.auth.getToken()) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
