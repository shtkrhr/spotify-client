import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowComponent } from './show/show.component';
import { ShowResolver } from './show/show.resolver';
import { AlbumComponent } from './album.component';
import { TrackComponent } from './show/tracks/track.component';
import { AnalyticsComponent } from './show/analytics/analytics.component';
import { TrackResolver } from './show/tracks/track.resolver';
import { AnalyticsResolver } from './show/analytics/analytics.resolver';

const routes: Routes = [
  {
    path: '',
    component: AlbumComponent,
    children: [
      {
        path: ':albumId',
        component: ShowComponent,
        resolve: {
          data: ShowResolver,
        },
        children: [
          {
            path: 'track',
            component: TrackComponent,
            resolve: {
              data: TrackResolver,
            },
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
            redirectTo: 'track',
          },
        ],
      },
      {
        path: '**',
        redirectTo: '/',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ShowResolver, TrackResolver, AnalyticsResolver],
})
export class AlbumRoutingModule { }
