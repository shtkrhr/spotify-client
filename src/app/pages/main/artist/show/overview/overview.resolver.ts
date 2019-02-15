import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ArtistService } from '../../../../../core/api/artist.service';
import { Artist } from '../../../../../core/api/responses/artist';
import { ShowResolvedData } from '../show.resolver';
import { Track } from '../../../../../core/api/responses/track';
import { PagingCollection } from '../../../../../core/api/responses/paging-collection';
import { AlbumSimplified } from '../../../../../core/api/responses/album';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OverviewResolvedData {
  artist: Artist;
  topTracks: Track[];
  albums$: Observable<PagingCollection<AlbumSimplified>>;
}

@Injectable()
export class OverviewResolver implements Resolve<OverviewResolvedData> {

  constructor(private artistApi: ArtistService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const artist = (route.parent.data.data as ShowResolvedData).artist;
    const subject = new ReplaySubject<PagingCollection<AlbumSimplified>>(1);
    this.artistApi.allAlbums(artist.id).subscribe(subject.next.bind(subject));

    return this.artistApi.topTracks(artist.id)
      .pipe(map(topTracks => ({artist, topTracks, albums$: subject.asObservable()})));
  }
}
