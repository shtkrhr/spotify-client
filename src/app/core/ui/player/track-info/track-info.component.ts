import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebPlaybackState } from '../../../player/player';

@Component({
  selector: 'sp-player-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss'],
})
export class TrackInfoComponent implements OnInit {

  @Input()
  state?: WebPlaybackState;

  @Output('nav')
  navEvent = new EventEmitter<string[]>();

  get track() {
    return this.state && this.state.track_window.current_track;
  }

  get album() {
    return this.track && this.track.album;
  }

  get jacketUrl() {
    return this.album &&
      this.track.album.images[0] &&
      this.track.album.images[0].url;
  }

  get artists() {
    return this.track && this.track.artists;
  }

  constructor() { }

  ngOnInit() {
  }

  uriToId(uri: string) {
    return uri.replace(/spotify\:[a-z]+\:/, '');
  }

  trackClick() {
    if (this.track) {
      this.navEvent.emit(['/track', this.track.id]);
    }
  }

  jacketClick() {
    if (this.album) {
      this.navEvent.emit(['/album', this.uriToId(this.album.uri)]);
    }
  }

  artistClick(uri: string) {
    if (this.track) {
      this.navEvent.emit(['/artist', this.uriToId(uri)]);
    }
  }

}
