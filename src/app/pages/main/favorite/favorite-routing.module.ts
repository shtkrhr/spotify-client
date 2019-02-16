import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteComponent } from './favorite.component';
import { FavoriteResolver } from './favorite.resolver';
import { AnalyticsComponent } from './analytics/analytics.component';
import { TrackComponent } from './track/track.component';
import { AlbumComponent } from './album/album.component';
import { ArtistComponent } from './artist/artist.component';
import { AnalyticsResolver } from './analytics/analytics.resolver';

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
        resolve: {
          data: AnalyticsResolver,
        },
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
  providers: [FavoriteResolver, AnalyticsResolver],
})
export class FavoriteRoutingModule {}
