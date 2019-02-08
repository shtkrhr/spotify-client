import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { OverviewComponent } from './overview/overview.component';
import { ArtistComponent } from './artist/artist.component';
import { AlbumComponent } from './album/album.component';
import { TrackComponent } from './track/track.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchResolver } from './search.resolver';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      data: SearchResolver,
    },
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
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
        path: 'playlist',
        component: PlaylistComponent,
      },
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SearchResolver],
})
export class SearchRoutingModule {}
