import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumComponent } from './album.component';
import { ShowComponent } from './show/show.component';

@NgModule({
  declarations: [
    AlbumComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    AlbumRoutingModule,
  ],
})
export class AlbumModule {}
