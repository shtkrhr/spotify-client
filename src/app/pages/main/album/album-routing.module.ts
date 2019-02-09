import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowComponent } from './show/show.component';
import { ShowResolver } from './show/show.resolver';
import { AlbumComponent } from './album.component';

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
export class AlbumRoutingModule { }
