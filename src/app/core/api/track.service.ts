import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InMemoryCache } from '../cache/in-memory-cache';
import { Track } from './responses/track';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { AudioFeatures } from './responses/audio-features';
import { isString } from '../util/util';

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

  features(...ids: string[]): Observable<AudioFeatures[]> {
    const observables = ids.map(id => {
      return this.featuresCache.get(id).pipe(catchError(_ => of(id)));
    });

    return combineLatest(observables).pipe(
      switchMap(list => {
        const idsToFetch = list.filter<string>(isString);
        if (idsToFetch.length === 0) {
          return of(list as AudioFeatures[]);
        }
        const featuresList = list.filter(v => !isString(v)) as AudioFeatures[];
        const params = {ids: idsToFetch.join(',')};
        return this.http.get<{audio_features: AudioFeatures[]}>(`${this.baseUrl}/audio-features`, {params})
          .pipe(
            tap(res => res.audio_features.forEach(f => this.featuresCache.set(f.id, f))),
            map(res => featuresList.concat(res.audio_features))
          );
      })
    );
  }

  cacheTrack(track: Track) {
    this.trackCache.set(track.id, track);
  }

}
