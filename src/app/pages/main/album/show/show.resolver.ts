import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Album } from '../../../../core/api/responses/album';
import { AlbumService } from '../../../../core/api/album.service';

export interface ShowResolvedData {
  album: Album;
}

@Injectable()
export class ShowResolver implements Resolve<ShowResolvedData> {

  constructor(private router: Router, private albumApi: AlbumService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const albumId = route.params.albumId;
    const handleError = () => {
      this.router.navigate(['/']);
      return EMPTY;
    };

    if (!albumId) {
      return handleError();
    }

    return this.albumApi.show(albumId).pipe(
      catchError(handleError),
      map(album => ({album}))
    );
  }
}
