import { Component, Input, OnInit } from '@angular/core';
import { Artist } from '../../api/responses/artist';

@Component({
  selector: 'sp-artist-thumbnail, a[sp-artist-thumbnail]',
  templateUrl: './artist-thumbnail.component.html',
  styleUrls: ['./artist-thumbnail.component.scss'],
})
export class ArtistThumbnailComponent implements OnInit {

  @Input()
  artist: Artist;

  constructor() {}

  ngOnInit() {
  }

}
