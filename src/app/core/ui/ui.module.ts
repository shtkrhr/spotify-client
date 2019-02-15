import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatIconModule, MatTableModule } from '@angular/material';
import { ArtistRelationDiagramComponent } from './artist-relation-diagram/artist-relation-diagram.component';
import { PlayerComponent } from './player/player.component';
import { TrackInfoComponent } from './player/track-info/track-info.component';
import { SeekBarComponent } from './player/seek-bar/seek-bar.component';
import { ActionComponent } from './player/action-button/action.component';
import { PlayButtonDirective } from './play-button/play-button.directive';
import { TrackListComponent } from './track-list/track-list.component';
import { AlbumThumbnailComponent } from './album-thumbnail/album-thumbnail.component';
import { ArtistThumbnailComponent } from './artist-thumbnail/artist-thumbnail.component';
import { ThumbnailComponent } from './thumbnail/thumbnail.component';
import { ThumbnailGroupComponent } from './thumbnail-group/thumbnail-group.component';
import { RouterModule } from '@angular/router';
import { FeaturesChartComponent } from './features-chart/features-chart.component';


@NgModule({
  declarations: [
    ArtistRelationDiagramComponent,
    PlayerComponent,
    TrackInfoComponent,
    SeekBarComponent,
    ActionComponent,
    PlayButtonDirective,
    TrackListComponent,
    AlbumThumbnailComponent,
    ArtistThumbnailComponent,
    ThumbnailComponent,
    ThumbnailGroupComponent,
    FeaturesChartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  exports: [
    ArtistRelationDiagramComponent,
    PlayerComponent,
    PlayButtonDirective,
    TrackListComponent,
    AlbumThumbnailComponent,
    ArtistThumbnailComponent,
    ThumbnailComponent,
    ThumbnailGroupComponent,
    FeaturesChartComponent,
  ],
})
export class UiModule {}
