import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatSelectModule, MatSlideToggleModule,
} from '@angular/material';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { OverviewComponent } from './overview/overview.component';
import { ArtistComponent } from './artist/artist.component';
import { AlbumComponent } from './album/album.component';
import { TrackComponent } from './track/track.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SearchService } from './search.service';
import { UiModule } from '../../../core/ui/ui.module';

// @todo: 結果表示のレイアウト
// @todo: 諸々のコンポーネント

@NgModule({
  declarations: [
    SearchComponent,
    OverviewComponent,
    ArtistComponent,
    AlbumComponent,
    TrackComponent,
    PlaylistComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchRoutingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    UiModule,
  ],
  providers: [
    SearchService,
  ],
})
export class SearchModule {}
