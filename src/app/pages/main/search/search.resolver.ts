import { Params, Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchService } from '../../../core/api/search.service';
import { isValidSearchParams, SearchParams } from '../../../core/api/method-params/search';
import { SearchResult } from '../../../core/api/responses/search-result';

export interface SearchResolvedData {
  params: SearchParams;
  result?: SearchResult;
  genres: string[];
}

@Injectable()
export class SearchResolver implements Resolve<SearchResolvedData> {

  constructor(private searchApi: SearchService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const params = this.parseParams(route.queryParams);
    return combineLatest(
      isValidSearchParams(params) ? this.searchApi.search(params) : of({}),
      this.searchApi.availableGrenres()
    ).pipe(map(([result, genres]) => ({
      params, genres,
      result: Object.keys(result).length > 0 ? result : undefined,
    })));
  }

  private parseParams(queryParams: Params) {
    const params = {} as SearchParams;

    if (queryParams.q) {
      params.q = queryParams.q + '';
    }
    if (queryParams.excepteds) {
      params.excepteds = Array.isArray(queryParams.excepteds) ? queryParams.excepteds : [queryParams.excepteds];
    }
    if (queryParams.genres) {
      params.genres = Array.isArray(queryParams.genres) ? queryParams.genres : [queryParams.genres];
    }

    const yearStart = parseInt(queryParams.year_s + '', 10);
    const yearEnd = parseInt(queryParams.year_e + '', 10);

    if (!isNaN(yearStart) && !isNaN(yearEnd)) {
      const start = Math.max(yearStart, 0);
      const end = Math.max(yearEnd, 0);
      params.year = {start, end};
    } else if (!isNaN(yearStart)) {
      const start = Math.max(yearStart, 0);
      params.year = {start, end: start};
    } else if (!isNaN(yearEnd)) {
      const end = Math.max(yearEnd, 0);
      params.year = {start: end, end};
    }

    return params;
  }
}
