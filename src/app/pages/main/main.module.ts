import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatListModule } from '@angular/material';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    MainComponent,
    AccountComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class MainModule {}
