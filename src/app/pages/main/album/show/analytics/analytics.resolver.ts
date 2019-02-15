import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Album } from '../../../../../core/api/responses/album';
import { PagingCollection } from '../../../../../core/api/responses/paging-collection';
import { TrackSimplified } from '../../../../../core/api/responses/track';
import { ShowResolvedData } from '../show.resolver';
import { Observable, ReplaySubject } from 'rxjs';
import { AlbumService } from '../../../../../core/api/album.service';
import { AudioFeatures, aveFeatures, maxFeatures, minFeatures } from '../../../../../core/api/responses/audio-features';
import { TrackService } from '../../../../../core/api/track.service';
import { map } from 'rxjs/operators';

export interface AnalyticsResolvedData {
  album: Album;
  tracksCollection$: Observable<PagingCollection<TrackSimplified>>;
  featuresList$: Observable<AudioFeatures[]>;
  featuresTable$: Observable<{key: string, ave: number, max: number, min: number}[]>;
}

@Injectable()
export class AnalyticsResolver implements Resolve<AnalyticsResolvedData> {

  constructor(private albumApi: AlbumService, private trackApi: TrackService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const parentData = route.parent.data.data as ShowResolvedData;
    const tracksSubject = new ReplaySubject<PagingCollection<TrackSimplified>>(1);
    const featuresListSubject = new ReplaySubject<AudioFeatures[]>(1);

    this.albumApi.allTracks(parentData.album.id).subscribe(tracksSubject.next.bind(tracksSubject));
    tracksSubject.subscribe(collection => {
      this.trackApi.features(...collection.items.map(item => item.id))
        .subscribe(list => {
          featuresListSubject.next(list);
          if (collection.completed) {
            featuresListSubject.complete();
          }
        });
    });

    return {
      album: parentData.album,
      tracksCollection$: tracksSubject.asObservable(),
      featuresList$: featuresListSubject.asObservable(),
      featuresTable$: featuresListSubject.asObservable().pipe(map(list => {
        const ave = aveFeatures(list);
        const max = maxFeatures(list);
        const min = minFeatures(list);
        const keys = Object.keys(ave);
        return keys.map(key => ({key, ave: ave[key], max: max[key], min: min[key]}));
      })),
    };
  }

}
