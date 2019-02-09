import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, EMPTY } from 'rxjs';
import { Track } from '../../../../core/api/responses/track';
import { TrackService } from '../../../../core/api/track.service';
import { catchError, map } from 'rxjs/operators';
import { AudioFeatures } from '../../../../core/api/responses/audio-features';

export interface ShowResolvedData {
  track: Track;
  features: AudioFeatures;
}

@Injectable()
export class ShowResolver implements Resolve<ShowResolvedData> {

  constructor(private router: Router, private trackApi: TrackService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const trackId = route.params.trackId;
    const handleError = () => {
      this.router.navigate(['/']);
      return EMPTY;
    };

    if (!trackId) {
      return handleError();
    }

    return combineLatest<Track, AudioFeatures>(
      this.trackApi.show(trackId).pipe(catchError(handleError)),
      this.trackApi.features(trackId).pipe(catchError(handleError)),
    ).pipe(map(([track, features]) => ({track, features})));
  }
}
