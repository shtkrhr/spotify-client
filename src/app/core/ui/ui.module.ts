import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { ArtistRelationDiagramComponent } from './artist-relation-diagram/artist-relation-diagram.component';
import { PlayerComponent } from './player/player.component';
import { TrackInfoComponent } from './player/track-info/track-info.component';
import { SeekBarComponent } from './player/seek-bar/seek-bar.component';
import { ActionComponent } from './player/action-button/action.component';


@NgModule({
  declarations: [
    ArtistRelationDiagramComponent,
    PlayerComponent,
    TrackInfoComponent,
    SeekBarComponent,
    ActionComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    ArtistRelationDiagramComponent,
    PlayerComponent,
  ],
})
export class UiModule {}
