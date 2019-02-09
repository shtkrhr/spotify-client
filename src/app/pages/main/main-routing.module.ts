import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'favorite',
        loadChildren: 'src/app/pages/main/favorite/favorite.module#FavoriteModule',
      },
      {
        path: 'track',
        loadChildren: 'src/app/pages/main/track/track.module#TrackModule',
      },
      {
        path: 'artist',
        loadChildren: 'src/app/pages/main/artist/artist.module#ArtistModule',
      },
      {
        path: 'search',
        loadChildren: 'src/app/pages/main/search/search.module#SearchModule',
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
})
export class MainRoutingModule {}
