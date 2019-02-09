import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatListModule, MatTableModule } from '@angular/material';

import { TrackRoutingModule } from './track-routing.module';
import { TrackComponent } from './track.component';
import { ShowComponent } from './show/show.component';

@NgModule({
  declarations: [
    TrackComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    TrackRoutingModule,
  ],
})
export class TrackModule {}
