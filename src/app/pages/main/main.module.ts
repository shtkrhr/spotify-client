import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatListModule } from '@angular/material';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { AccountComponent } from './account/account.component';
import { UiModule } from '../../core/ui/ui.module';

@NgModule({
  declarations: [
    MainComponent,
    AccountComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MainRoutingModule,
    UiModule,
  ],
})
export class MainModule {}
