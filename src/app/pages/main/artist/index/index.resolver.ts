import { Resolve } from '@angular/router';
import { Artist } from '../../../../core/api/responses/artist';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { FollowService } from '../../../../core/api/follow.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface IndexResolvedData {
  artists: Artist[];
}

@Injectable()
export class IndexResolver implements Resolve<IndexResolvedData> {

  constructor(private followApi: FollowService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.fetchArtists().pipe(map(artists => ({artists})));
  }

  private fetchArtists(carry: Artist[] = [], after?: string): Observable<Artist[]> {
    return this.followApi.artists(50, after).pipe(
      tap(paging => carry.push(...paging.items)),
      switchMap(paging => {
        return paging.total <= carry.length ?
          of(carry) :
          this.fetchArtists(carry, paging.cursors.after);
      }),
    );
  }
}
