import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatListModule } from '@angular/material';

import { UiModule } from '../../../core/ui/ui.module';

import { ArtistRoutingModule } from './artist-routing.module';
import { ArtistComponent } from './artist.component';
import { FollowingComponent } from './following/following.component';
import { ShowComponent } from './show/show.component';
import { OverviewComponent } from './show/overview/overview.component';
import { RelationComponent } from './show/relation/relation.component';

@NgModule({
  declarations: [
    ArtistComponent,
    FollowingComponent,
    ShowComponent,
    OverviewComponent,
    RelationComponent,
  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    ArtistRoutingModule,
    UiModule,
  ],
})
export class ArtistModule {}
