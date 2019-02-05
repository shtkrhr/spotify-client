import { HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { logOut } from '../../auth/auth';

@Injectable()
export class LogOutIfUnauthorizedInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const isSpotifyApi = req.url.indexOf('https://api.spotify.com') > -1;

    if (!isSpotifyApi) {
      return next.handle(req);
    }

    return next.handle(req).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        logOut();
      }
      return throwError(error);
    }));
  }
}
