import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Artist } from './responses/artist';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { InMemoryCache } from '../cache/in-memory-cache';
import { Paging } from './responses/paging';
import { Params } from '@angular/router';
import { AlbumSimplified } from './responses/album';
import { PagingCollection } from './responses/paging-collection';
import { Track, TrackSimplified } from './responses/track';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {

  readonly baseUrl = 'https://api.spotify.com/v1/artists';

  private artistCache = new InMemoryCache<Artist>();

  private topTracksCache = new InMemoryCache<Track[]>();

  private artistAlbumsCache = new InMemoryCache<Paging<AlbumSimplified>>();

  private relatedArtistsCache = new InMemoryCache<Artist[]>();

  constructor(private http: HttpClient) {}

  show(id: string): Observable<Artist> {
    return this.artistCache.get(id).pipe(catchError(_ => {
      return this.http.get<Artist>(`${this.baseUrl}/${id}`)
        .pipe(tap(this.cacheArtist.bind(this)));
    }));
  }

  relatedArtists(id: string): Observable<Artist[]> {
    return this.relatedArtistsCache.get(id).pipe(catchError(_ => {
      return this.http.get<Artist[]>(`${this.baseUrl}/${id}/related-artists`).pipe(
        map((res: any) => res.artists || []),
        tap(artists => {
          this.relatedArtistsCache.set(id, artists);
          artists.forEach(this.cacheArtist.bind(this));
        })
      );
    }));
  }

  topTracks(id: string): Observable<Track[]> {
    return this.topTracksCache.get(id).pipe(catchError(_ => {
      return this.http.get<{tracks: Track[]}>(`${this.baseUrl}/${id}/top-tracks`, {params: {market: 'from_token'}}).pipe(
        map(res => res.tracks),
        tap(tracks => this.topTracksCache.set(id, tracks)),
      );
    }));
  }

  albums(id: string, offset: number = 0, limit: number = 50): Observable<Paging<AlbumSimplified>> {
    const cacheKey = `${id},limit=${limit},offset=${offset}`;
    return this.artistAlbumsCache.get(cacheKey).pipe(catchError(_ => {
      const params = {offset, limit} as Params;
      return this.http.get<Paging<AlbumSimplified>>(`${this.baseUrl}/${id}/albums`, {params})
        .pipe(tap(albums => this.artistAlbumsCache.set(cacheKey, albums)));
    }));
  }

  allAlbums(id: string): Observable<PagingCollection<AlbumSimplified>> {
    const subject = new ReplaySubject<PagingCollection<AlbumSimplified>>(1);
    const limit = 50;
    return this.albums(id, 0, limit).pipe(
      tap(firstPaging => {
        const value = {completed: !firstPaging.next, items: firstPaging.items, total: firstPaging.total};
        subject.next(value);
        if (value.completed) {
          subject.complete();
          return;
        }
        let lastValue: PagingCollection<AlbumSimplified> = value;
        const remainingCount = Math.floor(firstPaging.total / limit);
        for (let i = 1; i <= remainingCount; i++) {
          this.albums(id, i * limit, limit).subscribe(paging => {
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

  cacheArtist(artist: Artist) {
    this.artistCache.set(artist.id, artist);
  }
}
