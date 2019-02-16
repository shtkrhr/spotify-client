import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SavedTrack, Track, TrackSimplified } from '../../api/responses/track';
import { AlbumBase } from '../../api/responses/album';
import { ArtistSimplified } from '../../api/responses/artist';
import { PlaylistBase } from '../../api/responses/playlist';
import { msToHHMMSS } from '../../util/util';
import { PlayerService as PlayerApi } from '../../api/player.service';
import { PlayerService as PlayerSdk } from '../../player/player.service';

type Context = AlbumBase | ArtistSimplified | PlaylistBase | TrackSimplified[];

type TrackListColumn = 'image' | 'index' | 'play' | 'fav' | 'name' | 'artist' | 'album' | 'duration';

// @todo: style
// @todo: SavedTrack, PlaylistTrack対応

@Component({
  selector: 'sp-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
})
export class TrackListComponent implements OnInit, OnChanges {

  @Input()
  tracks?: (TrackSimplified | Track | SavedTrack)[] = [];

  @Input()
  context?: Context;

  @Input()
  columns: TrackListColumn[] = [
    'image',
    'index',
    'play',
    // 'fav',
    'name',
    'artist',
    'album',
    'duration',
  ];

  // @Input()
  // filter?: string;

  displayedTracks: (TrackSimplified | Track)[] = [];

  constructor(private playerApi: PlayerApi, private playerSdk: PlayerSdk) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tracks) {
      this.displayedTracks = (this.tracks || []).map(t => {
        return t.hasOwnProperty('track') ? (t as SavedTrack).track : t as TrackSimplified;
      });
    }
  }

  durationString(track: TrackSimplified) {
    return msToHHMMSS(track.duration_ms);
  }

  contextFor(track: TrackSimplified) {
    if (this.context) {
      return this.context;
    }
    const index = this.displayedTracks.indexOf(track);
    return index > -1 ? this.displayedTracks.slice(index, index + 50) : [track];
  }

  play(track: TrackSimplified) {
    this.playerApi
      .executePlay(this.contextFor(track), () => this.playerSdk.deviceId, track, 0)
      .subscribe();
  }

}
