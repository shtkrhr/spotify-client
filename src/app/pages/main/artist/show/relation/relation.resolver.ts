import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ArtistService } from '../../../../../core/api/artist.service';
import { Artist } from '../../../../../core/api/responses/artist';
import { ShowResolvedData } from '../show.resolver';
import { catchError, map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { ArtistLink, ArtistRelationDataSet } from '../../../../../core/ui/artist-relation-diagram/artist-relation-diagram.type';

export interface RelationResolvedData {
  artist: Artist;
  relateds: Artist[];
  relationDataSet: ArtistRelationDataSet;
}

@Injectable()
export class RelationResolver implements Resolve<RelationResolvedData> {

  constructor(private artistApi: ArtistService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const artist = (route.parent.data.data as ShowResolvedData).artist;

    return this.artistApi.relatedArtists(artist.id).pipe(
      switchMap(relateds => {
        const artists = [artist, ...relateds];
        const linksObservables: Observable<ArtistLink[]>[] = artists.map(_artist => {
          return this.artistApi.relatedArtists(_artist.id).pipe(
            catchError(_ => of([])),
            map(relArtists => {
              return relArtists
                .filter(relArtist => artists.some(a => a.id === relArtist.id))
                .map(relArtist => ({source: _artist.id, target: relArtist.id}));
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
            return {relateds, artist, relationDataSet: {artists, links}};
          }),
        );
      }),
    );
  }
}
