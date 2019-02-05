import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from './responses/user';
import { InMemoryCache } from '../cache/in-memory-cache';
import { getAccessToken, onLogOut } from '../auth/auth';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  readonly baseUrl = 'https://api.spotify.com/v1';

  private userCache = new InMemoryCache<User>(90 * 60);

  constructor(private http: HttpClient) {
    onLogOut().subscribe(_ => this.userCache.clear());
  }

  me(): Observable<User> {
    const token = getAccessToken();
    if (!token) {
      return throwError('No access token.');
    }
    return this.userCache.get(token).pipe(catchError(_ => {
      return this.http.get<User>(`${this.baseUrl}/me`)
        .pipe(tap(user => this.userCache.set(token, user)));
    }));
  }

}
