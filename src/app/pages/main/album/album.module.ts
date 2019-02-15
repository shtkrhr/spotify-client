import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumComponent } from './album.component';
import { ShowComponent } from './show/show.component';
import { TrackComponent } from './show/tracks/track.component';
import { AnalyticsComponent } from './show/analytics/analytics.component';
import { MatButtonModule, MatIconModule, MatListModule, MatSelectModule, MatFormFieldModule } from '@angular/material';
import { UiModule } from '../../../core/ui/ui.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AlbumComponent,
    ShowComponent,
    TrackComponent,
    AnalyticsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AlbumRoutingModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    UiModule,
  ],
})
export class AlbumModule {}
