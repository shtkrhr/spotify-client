import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InMemoryCache } from '../cache/in-memory-cache';
import { Track } from './responses/track';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AudioFeatures } from './responses/audio-features';

@Injectable({
  providedIn: 'root',
})
export class TrackService {

  readonly baseUrl = 'https://api.spotify.com/v1';

  private trackCache = new InMemoryCache<Track>();

  private featuresCache = new InMemoryCache<AudioFeatures>();

  constructor(private http: HttpClient) {
  }

  show(id: string): Observable<Track> {
    return this.trackCache.get(id).pipe(catchError(_ => {
      return this.http.get<Track>(`${this.baseUrl}/tracks/${id}`)
        .pipe(tap(this.cacheTrack.bind(this)));
    }));
  }

  features(id: string): Observable<AudioFeatures> {
    return this.featuresCache.get(id).pipe(catchError(_ => {
      return this.http.get<AudioFeatures>(`${this.baseUrl}/audio-features/${id}`)
        .pipe(tap(features => this.featuresCache.set(id, features)));
    }));
  }

  cacheTrack(track: Track) {
    this.trackCache.set(track.id, track);
  }

}
