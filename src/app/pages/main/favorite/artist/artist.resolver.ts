import { Resolve, ActivatedRouteSnapshot, Router, NavigationStart } from '@angular/router';
import { Injectable } from '@angular/core';
import { ArtistService } from '../../../../core/api/artist.service';
import { FavoriteResolvedData } from '../favorite.resolver';
import { AsyncSubject, Observable } from 'rxjs';
import { Artist } from '../../../../core/api/responses/artist';
import { filter, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { PagingCollection } from '../../../../core/api/responses/paging-collection';
import { SavedTrack, Track } from '../../../../core/api/responses/track';
import { flatten, uniq } from 'lodash';

export interface ArtistGroup {
  artist: Artist;
  tracks: Track[];
}

export interface ArtistResolvedData {
  artistGroups$: Observable<ArtistGroup[]>;
}

@Injectable()
export class ArtistResolver implements Resolve<ArtistResolvedData> {

  constructor(private artistApi: ArtistService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const tracksCollection$ = (route.parent.data.data as FavoriteResolvedData).tracksCollection$;
    const artistsSubject = new AsyncSubject<Artist[]>();
    const navigationStart$ = this.router.events.pipe(filter(e => e instanceof NavigationStart));

    tracksCollection$.pipe(
      filter(collection => collection.completed),
      switchMap<PagingCollection<SavedTrack>, Artist[]>(collection => {
        const idsList = collection.items.map(item => item.track.artists.map(a => a.id));
        const ids = uniq(flatten<string>(idsList as any[]));
        return this.artistApi.get(...ids);
      }),
      takeUntil(navigationStart$),
    ).subscribe(artists => {
      artistsSubject.next(artists);
      artistsSubject.complete();
    });

    const artistGroups$ = artistsSubject.pipe(
      withLatestFrom(tracksCollection$),
      map<[Artist[], PagingCollection<SavedTrack>], ArtistGroup[]>(args => this.groupByArtist(...args)),
    );

    return {artistGroups$};
  }

  private groupByArtist(artists: Artist[], collection: PagingCollection<SavedTrack>) {
    const groupsMap = {} as { [artistId: string]: ArtistGroup };
    collection.items.forEach(({track}) => {
      track.artists.forEach(simpleArtist => {
        const artist = artists.find(_a => _a.id === simpleArtist.id);
        if (!artist) {
          return;
        }
        if (!groupsMap[simpleArtist.id]) {
          groupsMap[simpleArtist.id] = {artist, tracks: []};
        }
        groupsMap[simpleArtist.id].tracks.push(track);
      });
    });
    return Object.values(groupsMap).sort((a, b) => b.tracks.length - a.tracks.length);
  }

}
