import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const isSpotifyApi = req.url.indexOf('https://api.spotify.com') > -1;
    const accessToken = this.auth.getToken();

    if (!isSpotifyApi || !accessToken) {
      return next.handle(req);
    }

    const headers = req.headers.set('Authorization', `Bearer ${accessToken}`);

    return next.handle(req.clone({headers}));
  }
}
