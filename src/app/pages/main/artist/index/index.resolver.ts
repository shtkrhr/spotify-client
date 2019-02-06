import { Resolve } from '@angular/router';
import { Artist } from '../../../../core/api/responses/artist';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { FollowService } from '../../../../core/api/follow.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ArtistLink, ArtistRelationDataSet } from '../../../../core/ui/artist-relation-diagram/artist-relation-diagram.type';
import { ArtistService } from '../../../../core/api/artist.service';
import { combineLatest, Observable, of } from 'rxjs';

export interface IndexResolvedData {
  artists: Artist[];
  relationDataSet: ArtistRelationDataSet;
}

@Injectable()
export class IndexResolver implements Resolve<IndexResolvedData> {

  constructor(private followApi: FollowService, private artistApi: ArtistService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.followApi.allArtists().pipe(
      switchMap(artists => {
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
            return {artists, relationDataSet: {artists, links}};
          }),
        );
      }),
    );
  }
}
