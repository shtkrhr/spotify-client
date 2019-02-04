import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistRoutingModule } from './artist-routing.module';
import { ArtistComponent } from './artist.component';
import { ShowComponent } from './show/show.component';

@NgModule({
  declarations: [
    ArtistComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    ArtistRoutingModule,
  ],
})
export class ArtistModule {}
