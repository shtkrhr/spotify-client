import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ArtistService } from './artist.service';
import { isValidSearchParams, SearchParams, toSearchRequestParams } from './method-params/search';
import { SearchResult } from './responses/search-result';
import { getAccessToken, onLogOut } from '../auth/auth';
import { InMemoryCache } from '../cache/in-memory-cache';

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  readonly baseUrl = 'https://api.spotify.com/v1/search';

  private searchCache = new InMemoryCache<SearchResult>();

  private genres?: string[];

  constructor(private http: HttpClient, private artistApi: ArtistService) {
    onLogOut().subscribe(_ => this.searchCache.clear());
  }

  search(params: SearchParams): Observable<SearchResult> {
    if (!isValidSearchParams(params)) {
      throw new Error('Params is invalid.');
    }
    const token = getAccessToken();
    if (!token) {
      return throwError('No access token.');
    }

    const reqParams = toSearchRequestParams(params) as Params;

    const cacheKey = `${token}-${JSON.stringify(reqParams)}`;
    return this.searchCache.get(cacheKey).pipe(catchError<any, SearchResult>(_ => {
      return this.http.get<SearchResult>(this.baseUrl, {params: reqParams}).pipe(
        tap(result => {
          this.searchCache.set(cacheKey, result);
          if (result.artists) {
            result.artists.items.forEach(a => this.artistApi.cacheArtist(a));
          }
        })
      );
    }));
  }

  availableGrenres() {
    if (this.genres) {
      return of(this.genres);
    }
    return this.http.get('https://api.spotify.com/v1/recommendations/available-genre-seeds')
      .pipe(
        map<{genres: string[]}, string[]>(res => res.genres),
        tap(genres => this.genres = genres)
      );
  }

}
