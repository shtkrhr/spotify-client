import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Album } from '../../../../../core/api/responses/album';
import { PagingCollection } from '../../../../../core/api/responses/paging-collection';
import { TrackSimplified } from '../../../../../core/api/responses/track';
import { ShowResolvedData } from '../show.resolver';
import { Observable, ReplaySubject } from 'rxjs';
import { AlbumService } from '../../../../../core/api/album.service';

export interface TrackResolvedData {
  album: Album;
  tracksCollection$: Observable<PagingCollection<TrackSimplified>>;
}

@Injectable()
export class TrackResolver implements Resolve<TrackResolvedData> {

  constructor(private albumApi: AlbumService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const parentData = route.parent.data.data as ShowResolvedData;
    const subject = new ReplaySubject<PagingCollection<TrackSimplified>>(1);
    this.albumApi.allTracks(parentData.album.id).subscribe(subject.next.bind(subject));

    return {
      album: parentData.album,
      tracksCollection$: subject.asObservable(),
    };
  }

}
