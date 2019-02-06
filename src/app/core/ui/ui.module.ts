import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistRelationDiagramComponent } from './artist-relation-diagram/artist-relation-diagram.component';

@NgModule({
  declarations: [
    ArtistRelationDiagramComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ArtistRelationDiagramComponent,
  ],
})
export class UiModule {}
