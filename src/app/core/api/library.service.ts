import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { getAccessToken, onLogOut } from '../auth/auth';
import { InMemoryCache } from '../cache/in-memory-cache';
import { SavedTrack } from './responses/track';
import { TrackService } from './track.service';
import { Paging } from './responses/paging';
import { PagingCollection } from './responses/paging-collection';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {

  readonly baseUrl = 'https://api.spotify.com/v1/me';

  private userTracksCache = new InMemoryCache<Paging<SavedTrack>>(60 * 60);

  constructor(private http: HttpClient, private trackApi: TrackService) {
    onLogOut().subscribe(_ => this.userTracksCache.clear());
  }

  tracks(offset: number = 0, limit: number = 50): Observable<Paging<SavedTrack>> {
    const token = getAccessToken();
    if (!token) {
      return throwError('No access token.');
    }
    const cacheKey = `${token},limit=${limit},offset=${offset}`;
    return this.userTracksCache.get(cacheKey).pipe(catchError(_ => {
      const params = {offset, limit} as Params;
      return this.http.get<Paging<SavedTrack>>(`${this.baseUrl}/tracks`, {params}).pipe(tap(sTracks => {
        sTracks.items.map(st => this.trackApi.cacheTrack(st.track));
        this.userTracksCache.set(cacheKey, sTracks);
      }));
    }));
  }

  // @todo: cancel可能にする
  allTracks(): Observable<PagingCollection<SavedTrack>> {
    const subject = new ReplaySubject<PagingCollection<SavedTrack>>(1);
    const limit = 50;
    return this.tracks(0, limit).pipe(
      tap(firstPaging => {
        const value = {completed: !firstPaging.next, items: firstPaging.items, total: firstPaging.total};
        subject.next(value);
        if (value.completed) {
          subject.complete();
          return;
        }
        let lastValue: PagingCollection<SavedTrack> = value;
        const remainingCount = Math.floor(firstPaging.total / limit);
        for (let i = 1; i <= remainingCount; i++) {
          this.tracks(i * limit, limit).subscribe(paging => {
            const items = lastValue.items.concat(paging.items);
            const newValue = {
              items, total: lastValue.total,
              completed: items.length === lastValue.total,
            };
            subject.next(newValue);
            if (newValue.completed) {
              subject.complete();
            }
            lastValue = newValue;
          });
        }
      }),
      switchMap(_ => subject.asObservable()),
    );
  }
}
