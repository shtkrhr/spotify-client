import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';

@NgModule({
  declarations: [HomeComponent, IndexComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
  ],
})
export class MainModule {}
