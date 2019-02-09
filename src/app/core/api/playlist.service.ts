import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InMemoryCache } from '../cache/in-memory-cache';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Playlist } from './responses/playlist';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {

  readonly baseUrl = 'https://api.spotify.com/v1/playlists';

  private playlistCache = new InMemoryCache<Playlist>();

  // private tracksCache = new InMemoryCache<Album>();

  constructor(private http: HttpClient) {
  }

  show(id: string): Observable<Playlist> {
    return this.playlistCache.get(id).pipe(catchError(_ => {
      return this.http.get<Playlist>(`${this.baseUrl}/${id}`)
        .pipe(tap(this.cachePlaylist.bind(this)));
    }));
  }

  // tracks(id: string, offset: number = 0, limit: number = 50) {}

  cachePlaylist(playlist: Playlist) {
    this.playlistCache.set(playlist.id, playlist);
  }

}
