import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './responses/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  readonly baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {}

  me(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

}
