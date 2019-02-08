import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CursorBasedPaging } from './responses/paging';
import { Artist } from './responses/artist';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { InMemoryCache } from '../cache/in-memory-cache';
import { getAccessToken, onLogOut } from '../auth/auth';
import { ArtistService } from './artist.service';

@Injectable({
  providedIn: 'root',
})
export class FollowService {

  readonly baseUrl = 'https://api.spotify.com/v1';

  private followingArtistsCache = new InMemoryCache<CursorBasedPaging<Artist>>(90 * 60);

  constructor(private http: HttpClient, private artistApi: ArtistService) {
    onLogOut().subscribe(_ => this.followingArtistsCache.clear())
  }

  artists(limit: number = 50, after?: string): Observable<CursorBasedPaging<Artist>> {
    const token = getAccessToken();
    if (!token) {
      return throwError('No access token.');
    }
    const cacheKey = `${token},limit=${limit},after=${after || ''}`;
    return this.followingArtistsCache.get(cacheKey).pipe(catchError(_ => {
      const params = Object.assign({type: 'artist', limit}, after ? {after} : {});
      return this.http.get(`${this.baseUrl}/me/following`, {params}).pipe(
        map<any, CursorBasedPaging<Artist>>(res => res.artists),
        tap(paging => {
          this.followingArtistsCache.set(cacheKey, paging);
          paging.items.forEach(this.artistApi.cacheArtist.bind(this.artistApi));
        }),
      );
    }));
  }

  allArtists(carry: Artist[] = [], after?: string): Observable<Artist[]> {
    return this.artists(50, after).pipe(
      tap(paging => carry.push(...paging.items)),
      switchMap(paging => {
        return paging.total <= carry.length ?
          of(carry) :
          this.allArtists(carry, paging.cursors.after);
      }),
    );
  }

}
