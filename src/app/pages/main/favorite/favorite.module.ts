import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';

import { FavoriteRoutingModule } from './favorite-routing.module';
import { FavoriteComponent } from './favorite.component';
import { ArtistComponent } from './artist/artist.component';
import { TrackComponent } from './track/track.component';
import { AlbumComponent } from './album/album.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { UiModule } from '../../../core/ui/ui.module';

// @todo: filter, sort

@NgModule({
  declarations: [
    FavoriteComponent,
    ArtistComponent,
    TrackComponent,
    AlbumComponent,
    AnalyticsComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FavoriteRoutingModule,
    UiModule,
  ]
})
export class FavoriteModule { }
