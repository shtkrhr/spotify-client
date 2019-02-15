import { Component, Input, OnInit } from '@angular/core';
import { AlbumBase } from '../../api/responses/album';

@Component({
  selector: 'sp-album-thumbnail, a[sp-album-thumbnail]',
  templateUrl: './album-thumbnail.component.html',
  styleUrls: ['./album-thumbnail.component.scss'],
})
export class AlbumThumbnailComponent implements OnInit {

  @Input()
  album: AlbumBase;

  constructor() {}

  ngOnInit() {
  }

}
