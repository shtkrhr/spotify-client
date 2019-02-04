import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistComponent } from './artist.component';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';

import { IndexResolver } from './index/index.resolver';
import { ShowResolver } from './show/show.resolver';

const routes: Routes = [
  {
    path: '',
    component: ArtistComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
        resolve: {
          data: IndexResolver,
        },
      },
      {
        path: ':artistId',
        component: ShowComponent,
        resolve: {
          data: ShowResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    IndexResolver,
    ShowResolver,
  ],
})
export class ArtistRoutingModule {}
