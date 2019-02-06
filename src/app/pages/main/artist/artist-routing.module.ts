import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistComponent } from './artist.component';
import { FollowingComponent } from './following/following.component';
import { ShowComponent } from './show/show.component';

import { FollowingResolver } from './following/following.resolver';
import { ShowResolver } from './show/show.resolver';

const routes: Routes = [
  {
    path: '',
    component: ArtistComponent,
    children: [
      {
        path: 'following',
        component: FollowingComponent,
        resolve: {
          data: FollowingResolver,
        },
      },
      {
        path: ':artistId',
        component: ShowComponent,
        resolve: {
          data: ShowResolver,
        },
      },
      {
        path: '**',
        redirectTo: 'following',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    FollowingResolver,
    ShowResolver,
  ],
})
export class ArtistRoutingModule {}
