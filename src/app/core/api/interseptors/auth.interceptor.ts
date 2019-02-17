import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { getAccessToken } from '../../auth/auth';
import { Injectable } from '@angular/core';
import { isSpotifyApi } from './util';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = getAccessToken();

    if (isSpotifyApi(req) && accessToken) {
      const headers = req.headers.set('Authorization', `Bearer ${accessToken}`);
      return next.handle(req.clone({headers}));
    }

    return next.handle(req);
  }
}
