import { Resolve } from '@angular/router';
import { Artist } from '../../../../core/api/responses/artist';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { FollowService } from '../../../../core/api/follow.service';
import { map } from 'rxjs/operators';

export interface IndexResolvedData {
  artists: Artist[];
}

@Injectable()
export class IndexResolver implements Resolve<IndexResolvedData> {

  constructor(private followApi: FollowService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.followApi.allArtists().pipe(map(artists => ({artists})));
  }
}
