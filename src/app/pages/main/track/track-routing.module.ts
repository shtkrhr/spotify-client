import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowComponent } from './show/show.component';
import { TrackComponent } from './track.component';
import { ShowResolver } from './show/show.resolver';

const routes: Routes = [
  {
    path: '',
    component: TrackComponent,
    children: [
      {
        path: ':trackId',
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
export class TrackRoutingModule {}
