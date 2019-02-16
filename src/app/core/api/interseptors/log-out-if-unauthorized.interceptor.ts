import { HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { logOut } from '../../auth/auth';
import { isSpotifyApi } from './util';

@Injectable()
export class LogOutIfUnauthorizedInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!isSpotifyApi(req)) {
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
