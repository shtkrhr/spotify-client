import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteComponent } from './favorite.component';
import { FavoriteResolver } from './favorite.resolver';
import { AnalyticsComponent } from './analytics/analytics.component';
import { TrackComponent } from './track/track.component';
import { AlbumComponent } from './album/album.component';
import { ArtistComponent } from './artist/artist.component';
import { GenreComponent } from './analytics/genre/genre.component';
import { TrackComponent as AnalyticsTrackComponent } from './analytics/track/track.component';
import { TrackResolver } from './analytics/track/track.resolver';
import { GenreResolver } from './analytics/genre/genre.resolver';

const routes: Routes = [
  {
    path: '',
    component: FavoriteComponent,
    resolve: {
      data: FavoriteResolver,
    },
    children: [
      {
        path: 'artist',
        component: ArtistComponent,
      },
      {
        path: 'album',
        component: AlbumComponent,
      },
      {
        path: 'track',
        component: TrackComponent,
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        children: [
          {
            path: 'genre',
            component: GenreComponent,
            resolve: {
              data: GenreResolver,
            },
            runGuardsAndResolvers: 'paramsOrQueryParamsChange',
          },
          {
            path: 'track',
            component: AnalyticsTrackComponent,
            resolve: {
              data: TrackResolver,
            },
          },
          {
            path: '**',
            redirectTo: 'genre',
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'artist',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    FavoriteResolver,
    TrackResolver,
    GenreResolver,
  ],
})
export class FavoriteRoutingModule {}
