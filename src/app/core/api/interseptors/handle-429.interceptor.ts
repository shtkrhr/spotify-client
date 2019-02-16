import { HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delayWhen, map, retryWhen, switchMap } from 'rxjs/operators';
import { of, throwError, timer } from 'rxjs';
import { isSpotifyApi } from './util';

@Injectable()
export class Handle429Interceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!isSpotifyApi(req)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(retryWhen(errors => errors.pipe(
      switchMap(e => e instanceof HttpErrorResponse && e.status === 429 ? of(e) : throwError(e)),
      map<HttpErrorResponse, number>(e => (parseInt(e.headers.get('Retry-After'), 10) || 1) * 1000),
      delayWhen<number>(interval => timer(interval)),
    )));
  }
}
