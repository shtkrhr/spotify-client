import { Resolve, ActivatedRouteSnapshot, Router, NavigationStart } from '@angular/router';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { PagingCollection } from '../../../../../core/api/responses/paging-collection';
import { SavedTrack } from '../../../../../core/api/responses/track';
import { FavoriteResolvedData } from '../../favorite.resolver';
import { BarChartDatum } from '../../../../../core/ui/bar-chart/bar-chart.component';
import { filter, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ArtistService } from '../../../../../core/api/artist.service';
import { Artist } from '../../../../../core/api/responses/artist';
import { flatten, uniq } from 'lodash';

export interface GenreResolvedData {
  tracksCollection$: Observable<PagingCollection<SavedTrack>>;
  genredArtists$: Observable<Artist[]>;
  chartData$: Observable<BarChartDatum[]>;
  selectedGenre$: Observable<string>;
}

@Injectable()
export class GenreResolver implements Resolve<GenreResolvedData> {

  constructor(private artistApi: ArtistService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const tracksCollection$ = (route.parent.parent.data.data as FavoriteResolvedData).tracksCollection$;
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


    const chartData$ = artistsSubject.pipe(map(artists => {
      const dataMap = new Map<string, BarChartDatum>();
      artists.forEach(a => {
        a.genres.forEach(genre => {
          if (dataMap.has(genre)) {
            dataMap.get(genre).value += 1;
          } else {
            dataMap.set(genre, {id: genre, name: genre.toUpperCase(), value: 1});
          }
        });
      });
      return Array.from(dataMap.values());
    }));

    const genreOnParams: string = Array.isArray(route.queryParams.genre) ? route.queryParams.genre[0] : route.queryParams.genre;
    const selectedGenre$ = chartData$.pipe(
      map(data => data.some(datum => datum.id === genreOnParams) ? genreOnParams : '')
    );

    const genredArtists$ = selectedGenre$.pipe(
      withLatestFrom(artistsSubject.asObservable()),
      map(([genre, artists]) => artists.filter(artist => artist.genres.indexOf(genre) > -1)),
    );

    return {
      tracksCollection$,
      chartData$,
      selectedGenre$,
      genredArtists$,
    };
  }

}
