import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LogOutIfUnauthorizedInterceptor } from './log-out-if-unauthorized.interceptor';
import { ThrottleInterceptor } from './throttle.interceptor';
import { Handle429Interceptor } from './handle-429.interceptor';

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: ThrottleInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: Handle429Interceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: LogOutIfUnauthorizedInterceptor, multi: true},
];
