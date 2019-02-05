import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistRelationGraphComponent } from './artist-relation-graph/artist-relation-graph.component';

@NgModule({
  declarations: [
    ArtistRelationGraphComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ArtistRelationGraphComponent,
  ],
})
export class UiModule {}
