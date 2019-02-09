import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowComponent } from './show/show.component';
import { ShowResolver } from './show/show.resolver';
import { PlaylistComponent } from './playlist.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistComponent,
    children: [
      {
        path: ':playlistId',
        component: ShowComponent,
        resolve: {
          data: ShowResolver,
        },
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
  providers: [ShowResolver],
})
export class PlaylistRoutingModule {}
