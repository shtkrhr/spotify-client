import { Resolve, Router } from '@angular/router';
import { Artist } from '../../../../core/api/responses/artist';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ArtistService } from '../../../../core/api/artist.service';

export interface ShowResolvedData {
  artist: Artist;
}

@Injectable()
export class ShowResolver implements Resolve<ShowResolvedData> {

  constructor(private artistApi: ArtistService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const artistId = route.params.artistId;
    const handleError = () => {
      this.router.navigate(['/']);
      return EMPTY;
    };

    if (!artistId) {
      return handleError();
    }

    return this.artistApi.get(artistId).pipe(
      map(artists => {
        if (artists.length === 0) {
          throw Error;
        }
        return {artist: artists[0]};
      }),
      catchError(handleError),
    );
  }
}
