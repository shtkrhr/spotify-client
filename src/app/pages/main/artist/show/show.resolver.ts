import { Resolve, Router } from '@angular/router';
import { Artist } from '../../../../core/api/responses/artist';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ArtistService } from '../../../../core/api/artist.service';
import { ArtistLink, ArtistRelationDataSet } from '../../../../core/ui/artist-relation-diagram/artist-relation-diagram.type';

export interface ShowResolvedData {
  artist: Artist;
  relateds: Artist[];
  relationDataSet: ArtistRelationDataSet;
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
      map(([artist, relateds]: [Artist, Artist[]]) => ({artist, relateds})),
      switchMap(data => {
        const artists = [data.artist, ...data.relateds];
        const linksObservables: Observable<ArtistLink[]>[] = artists.map(artist => {
          return this.artistApi.relatedArtists(artist.id).pipe(
            catchError(_ => of([])),
            map(relArtists => {
              return relArtists
                .filter(relArtist => artists.some(a => a.id === relArtist.id))
                .map(relArtist => ({source: artist.id, target: relArtist.id}));
            }),
          );
        });

        return combineLatest(linksObservables).pipe(
          catchError(_ => of([])),
          map(linksList => {
            const links = linksList.reduce((all, _links) => {
              all.push(..._links);
              return all;
            }, [] as ArtistLink[]);
            return Object.assign(data, {relationDataSet: {artists, links}});
          }),
        );
      }),
      catchError(handleError),
    );
  }
}
