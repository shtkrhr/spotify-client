import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CursorBasedPaging } from './responses/cursor-based-paging';
import { Artist } from './responses/artist';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FollowService {

  readonly baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {}

  artists(limit: number = 10, after?: string): Observable<CursorBasedPaging<Artist>> {
    const params = Object.assign({type: 'artist', limit}, after ? {after} : {});
    return this.http.get(`${this.baseUrl}/me/following`, {params})
      .pipe(map((res: any) => res.artists));
  }

}
