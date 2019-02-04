import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistRoutingModule } from './artist-routing.module';
import { ArtistComponent } from './artist.component';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';

@NgModule({
  declarations: [
    ArtistComponent,
    IndexComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    ArtistRoutingModule,
  ],
})
export class ArtistModule {}
