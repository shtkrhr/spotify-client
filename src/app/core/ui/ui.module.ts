import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistRelationGraphComponent } from './artist-relation-graph/artist-relation-graph.component';
import { ArtistRelationDiagramComponent } from './artist-relation-diagram/artist-relation-diagram.component';

@NgModule({
  declarations: [
    ArtistRelationGraphComponent,
    ArtistRelationDiagramComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ArtistRelationGraphComponent,
    ArtistRelationDiagramComponent,
  ],
})
export class UiModule {}
