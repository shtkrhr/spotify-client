import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { isSpotifyApi } from './util';

let lastRequestTimestamp = 0;
const INTERVAL = 50;

@Injectable()
export class ThrottleInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!isSpotifyApi(req)) {
      return next.handle(req);
    }

    const now = Date.now();
    lastRequestTimestamp = Math.max(lastRequestTimestamp + INTERVAL, now);
    return timer(lastRequestTimestamp - now)
      .pipe(switchMap(_ => next.handle(req)));
  }
}
