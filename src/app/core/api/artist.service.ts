import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from './responses/artist';
import { catchError, map, tap } from 'rxjs/operators';
import { InMemoryCache } from '../cache/in-memory-cache';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {

  readonly baseUrl = 'https://api.spotify.com/v1/artists';

  private artistCache = new InMemoryCache<Artist>();

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

  cacheArtist(artist: Artist) {
    this.artistCache.set(artist.id, artist);
  }
}
