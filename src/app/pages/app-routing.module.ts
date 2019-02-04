import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { GuestGuard } from '../core/auth/guest.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: 'src/app/pages/auth/auth.module#AuthModule',
    canLoad: [GuestGuard],
  },
  {
    path: '',
    loadChildren: 'src/app/pages/main/main.module#MainModule',
    canLoad: [AuthenticatedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
