import { Resolve, Router } from '@angular/router';
import { Artist } from '../../../../core/api/responses/artist';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ArtistService } from '../../../../core/api/artist.service';
import { combineLatest, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export interface ShowResolvedData {
  artist: Artist;
  relateds: Artist[];
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

    return combineLatest(
      this.artistApi.show(artistId).pipe(catchError(handleError)),
      this.artistApi.relatedArtists(artistId).pipe(catchError(handleError)),
    ).pipe(
      map(([artist, relateds]) => ({artist, relateds})),
      catchError(handleError),
    );
  }
}
