import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InMemoryCache } from '../cache/in-memory-cache';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Album } from './responses/album';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {

  readonly baseUrl = 'https://api.spotify.com/v1/albums';

  private albumCache = new InMemoryCache<Album>();

  // private tracksCache = new InMemoryCache<Album>();

  constructor(private http: HttpClient) {
  }

  show(id: string): Observable<Album> {
    return this.albumCache.get(id).pipe(catchError(_ => {
      return this.http.get<Album>(`${this.baseUrl}/${id}`)
        .pipe(tap(this.cacheAlbum.bind(this)));
    }));
  }

  // tracks(id: string, offset: number = 0, limit: number = 50) {}

  cacheAlbum(album: Album) {
    this.albumCache.set(album.id, album);
  }

}
