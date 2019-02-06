import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthenticatedGuard } from '../../core/auth/authenticated.guard';
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
        path: 'artist',
        loadChildren: 'src/app/pages/main/artist/artist.module#ArtistModule',
        canLoad: [AuthenticatedGuard],
      },
      {
        path: '**',
        redirectTo: 'account',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
