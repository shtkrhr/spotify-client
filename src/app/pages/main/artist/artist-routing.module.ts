import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistComponent } from './artist.component';
import { ShowComponent } from './show/show.component';
import { ShowResolver } from './show/show.resolver';

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
        }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ShowResolver],
})
export class ArtistRoutingModule {}
