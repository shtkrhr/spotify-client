import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Playlist } from '../../../../core/api/responses/playlist';
import { PlaylistService } from '../../../../core/api/playlist.service';

export interface ShowResolvedData {
  playlist: Playlist;
}

@Injectable()
export class ShowResolver implements Resolve<ShowResolvedData> {

  constructor(private router: Router, private playlistApi: PlaylistService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const playlistId = route.params.playlistId;
    const handleError = () => {
      this.router.navigate(['/']);
      return EMPTY;
    };

    if (!playlistId) {
      return handleError();
    }

    return this.playlistApi.show(playlistId).pipe(
      catchError(handleError),
      map(playlist => ({playlist}))
    );
  }
}
