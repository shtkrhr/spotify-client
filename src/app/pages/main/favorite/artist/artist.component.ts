import { Component, OnInit } from '@angular/core';
import { FavoriteResolvedData } from '../favorite.resolver';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ArtistSimplified } from '../../../../core/api/responses/artist';
import { Track } from '../../../../core/api/responses/track';

interface ArtistGroup {
  artist: ArtistSimplified;
  tracks: Track[];
}

@Component({
  selector: 'sp-favorite-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {

  data?: FavoriteResolvedData;

  groups$?: Observable<ArtistGroup[]>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.data = data.data;
      this.groups$ = this.groupByArtist(this.data);
    });
  }

  private groupByArtist(data: FavoriteResolvedData) {
    return data.tracksCollection$.pipe(map(collection => {
      const artists = {} as {[id: string]: ArtistGroup};
      collection.items.forEach(({track}) => {
        track.artists.forEach(artist => {
          if (!artists[artist.id]) {
            artists[artist.id] = {artist, tracks: []};
          }
          artists[artist.id].tracks.push(track);
        });
      });
      return Object.values(artists);
    }));
  }

}
