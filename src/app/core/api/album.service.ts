import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InMemoryCache } from '../cache/in-memory-cache';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { Album } from './responses/album';
import { Paging } from './responses/paging';
import { TrackSimplified } from './responses/track';
import { Params } from '@angular/router';
import { PagingCollection } from './responses/paging-collection';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {

  readonly baseUrl = 'https://api.spotify.com/v1/albums';

  private albumCache = new InMemoryCache<Album>();

  private albumTracksCache = new InMemoryCache<Paging<TrackSimplified>>(60 * 60);

  constructor(private http: HttpClient) {
  }

  show(id: string): Observable<Album> {
    return this.albumCache.get(id).pipe(catchError(_ => {
      return this.http.get<Album>(`${this.baseUrl}/${id}`)
        .pipe(tap(this.cacheAlbum.bind(this)));
    }));
  }

  tracks(id: string, offset: number = 0, limit: number = 50): Observable<Paging<TrackSimplified>> {
    const cacheKey = `${id},limit=${limit},offset=${offset}`;
    return this.albumTracksCache.get(cacheKey).pipe(catchError(_ => {
      const params = {offset, limit} as Params;
      return this.http.get<Paging<TrackSimplified>>(`${this.baseUrl}/${id}/tracks`, {params})
        .pipe(tap(tracks => this.albumTracksCache.set(cacheKey, tracks)));
    }));
  }

  allTracks(id: string): Observable<PagingCollection<TrackSimplified>> {
    const subject = new ReplaySubject<PagingCollection<TrackSimplified>>(1);
    const limit = 50;
    return this.tracks(id, 0, limit).pipe(
      tap(firstPaging => {
        const value = {completed: !firstPaging.next, items: firstPaging.items, total: firstPaging.total};
        subject.next(value);
        if (value.completed) {
          subject.complete();
          return;
        }
        let lastValue: PagingCollection<TrackSimplified> = value;
        const remainingCount = Math.floor(firstPaging.total / limit);
        for (let i = 1; i <= remainingCount; i++) {
          this.tracks(id, i * limit, limit).subscribe(paging => {
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

  cacheAlbum(album: Album) {
    this.albumCache.set(album.id, album);
  }

}
