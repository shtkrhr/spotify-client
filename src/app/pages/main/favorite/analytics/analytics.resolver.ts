import { Resolve, ActivatedRouteSnapshot, Router, NavigationStart } from '@angular/router';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { PagingCollection } from '../../../../core/api/responses/paging-collection';
import { SavedTrack } from '../../../../core/api/responses/track';
import { AudioFeatures } from '../../../../core/api/responses/audio-features';
import { TrackService } from '../../../../core/api/track.service';
import { FavoriteResolvedData } from '../favorite.resolver';
import { filter, takeUntil } from 'rxjs/operators';

export interface AnalyticsResolvedData {
  tracksCollection$: Observable<PagingCollection<SavedTrack>>;
  featuresList$: Observable<AudioFeatures[]>;
}

@Injectable()
export class AnalyticsResolver implements Resolve<AnalyticsResolvedData> {

  constructor(private trackApi: TrackService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const tracksCollection$ = (route.parent.data.data as FavoriteResolvedData).tracksCollection$;
    const featuresListSubject = new AsyncSubject<AudioFeatures[]>();
    const navigationStart$ = this.router.events.pipe(filter(e => e instanceof NavigationStart));

    tracksCollection$.pipe(takeUntil(navigationStart$)).subscribe(collection => {
      if (!collection.completed) {
        return;
      }
      this.trackApi.features(...collection.items.map(item => item.track.id))
        .pipe(takeUntil(navigationStart$))
        .subscribe(list => {
          featuresListSubject.next(list);
          featuresListSubject.complete();
        });
    });

    return {
      tracksCollection$,
      featuresList$: featuresListSubject.asObservable(),
    };
  }

}
