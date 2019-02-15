import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Device } from './responses/device';
import { catchError, map } from 'rxjs/operators';
import { CurrentlyPlaying, PlayingContext, RepeatState } from './responses/playing-context';
import { CursorBasedPaging } from './responses/paging';
import { PlayHistory } from './responses/play-history';
import { PlayRequestBody } from './request-params/play';
import { removeEmptyKey } from '../util/util';
import { TrackSimplified } from './responses/track';
import { AlbumBase } from './responses/album';
import { ArtistSimplified } from './responses/artist';
import { PlaylistBase } from './responses/playlist';

export type PlayContext = AlbumBase | ArtistSimplified | PlaylistBase | TrackSimplified[];

@Injectable({
  providedIn: 'root',
})
export class PlayerService {

  readonly baseUrl = 'https://api.spotify.com/v1/me/player';

  constructor(private http: HttpClient) {}

  devices(): Observable<Device[]> {
    return this.http.get(`${this.baseUrl}/devices`)
      .pipe(map<{devices: Device[]}, Device[]>(res => res.devices));
  }

  playingContext(): Observable<PlayingContext> {
    return this.http.get<PlayingContext>(this.baseUrl);
  }

  recentlyPlayed(before?: string, after?: string, limit: number = 50): Observable<CursorBasedPaging<PlayHistory>> {
    if (before && after) {
      throw new Error;
    }
    const params = removeEmptyKey({limit, before, after});
    return this.http.get<CursorBasedPaging<PlayHistory>>(`${this.baseUrl}/recently-played`, {params});
  }

  currentlyPlaying(): Observable<CurrentlyPlaying> {
    return this.http.get<CurrentlyPlaying>(`${this.baseUrl}/currently-playing`);
  }

  pause(device_id?: string) {
    const params = removeEmptyKey({device_id});
    return this.http.put(`${this.baseUrl}/pause`, null, {params});
  }

  seek(position_ms: number, device_id?: string) {
    const params = removeEmptyKey({position_ms, device_id});
    return this.http.put(`${this.baseUrl}/seek`, null, {params});
  }

  repeat(state: RepeatState, device_id?: string) {
    const params = removeEmptyKey({state, device_id});
    return this.http.put(`${this.baseUrl}/repeat`, null, {params});
  }

  volume(volume_percent: number, device_id?: string) {
    const params = removeEmptyKey({volume_percent, device_id});
    return this.http.put(`${this.baseUrl}/volume`, null, {params});
  }

  next(device_id?: string) {
    const params = removeEmptyKey({device_id});
    return this.http.post(`${this.baseUrl}/next`, null, {params});
  }

  previous(device_id?: string) {
    const params = removeEmptyKey({device_id});
    return this.http.post(`${this.baseUrl}/previous`, null, {params});
  }

  play(body: PlayRequestBody, device_id?: string) {
    const params = removeEmptyKey({device_id});
    return this.http.put(`${this.baseUrl}/play`, body, {params});
  }

  shuffle(state: boolean, device_id?: string) {
    const params = removeEmptyKey({state, device_id});
    return this.http.put(`${this.baseUrl}/shuffle`, null, {params});
  }

  transfer(device_ids: string[], play?: boolean) {
    return this.http.put(this.baseUrl, {device_ids, play});
  }

  executePlay(context: PlayContext, deviceId?: () => string | undefined, offset: number | TrackSimplified = 0, position: number = 0) {
    const body: PlayRequestBody = Array.isArray(context) ?
      {uris: context.map(t => t.uri)} :
      {context_uri: context.uri};
    body.offset = offset.hasOwnProperty('uri') ?
      {uri: (offset as TrackSimplified).uri} :
      {position: offset as number};
    body.position_ms = position;

    return this.play(body).pipe(
      catchError(_ => deviceId && deviceId() ? this.play(body, deviceId()) : EMPTY),
    );
  }

}
