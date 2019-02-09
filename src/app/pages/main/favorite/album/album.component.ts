import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FavoriteResolvedData } from '../favorite.resolver';
import { map } from 'rxjs/operators';
import { AlbumSimplified } from '../../../../core/api/responses/album';
import { Observable } from 'rxjs';
import { Track } from '../../../../core/api/responses/track';

interface AlbumGroup {
  album: AlbumSimplified;
  tracks: Track[];
}

@Component({
  selector: 'sp-favorite-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  data?: FavoriteResolvedData;

  groups$?: Observable<AlbumGroup[]>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.data = data.data;
      this.groups$ = this.groupByAlbum(this.data);
    });
  }

  private groupByAlbum(data: FavoriteResolvedData) {
    return data.tracksCollection$.pipe(map(collection => {
      const albums = {} as {[id: string]: AlbumGroup};
      collection.items.forEach(({track}) => {
        if (!albums[track.album.id]) {
          albums[track.album.id] = {album: track.album, tracks: []};
        }
        albums[track.album.id].tracks.push(track);
      });
      return Object.values(albums);
    }));
  }

}
