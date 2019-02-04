import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from './responses/artist';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ArtistService {

  readonly baseUrl = 'https://api.spotify.com/v1/artists';

  constructor(private http: HttpClient) {}

  show(id: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.baseUrl}/${id}`);
  }

  relatedArtists(id: string): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.baseUrl}/${id}/related-artists`)
      .pipe(map((res: any) => res.artists || []));
  }
}
