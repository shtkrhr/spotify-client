import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistComponent } from './artist.component';
import { ShowComponent } from './show/show.component';

import { ShowResolver } from './show/show.resolver';
import { OverviewComponent } from './show/overview/overview.component';
import { RelationComponent } from './show/relation/relation.component';
import { OverviewResolver } from './show/overview/overview.resolver';
import { RelationResolver } from './show/relation/relation.resolver';

const routes: Routes = [
  {
    path: '',
    component: ArtistComponent,
    children: [
      {
        path: ':artistId',
        component: ShowComponent,
        resolve: {
          data: ShowResolver,
        },
        children: [
          {
            path: 'overview',
            component: OverviewComponent,
            resolve: {
              data: OverviewResolver,
            },
          },
          {
            path: 'relation',
            component: RelationComponent,
            resolve: {
              data: RelationResolver,
            },
          },
          {
            path: '**',
            redirectTo: 'overview',
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
  providers: [
    ShowResolver,
    OverviewResolver,
    RelationResolver,
  ],
})
export class ArtistRoutingModule {}
