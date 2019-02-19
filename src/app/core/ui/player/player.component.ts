import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { filter, map, switchMap } from 'rxjs/operators';
import { PlayerService as PlayerSDK } from '../../player/player.service';
import { PlayerService as PlayerApi } from '../../api/player.service';
import { RepearMode } from '../../player/player';
import { RepeatState } from '../../api/responses/playing-context';
import { getAccessToken } from '../../auth/auth';
import { environment as env } from '../../../../environments/environment';

// @todo: activeでないときのcontext更新

const PLAYER_INSTANCES = new Set<PlayerComponent>();

const PLAYER_NAME = 'Spotify Client';

@Component({
  selector: 'sp-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {

  @Output('nav')
  navEvent = new EventEmitter<string[]>();

  readonly state$ = this.playerSdk.playerStateChanged$();

  readonly repeatMode = RepearMode;

  constructor(readonly playerSdk: PlayerSDK,
              private playerApi: PlayerApi) {
  }

  ngOnInit() {
    if (PLAYER_INSTANCES.size === 0) {
      this.playerSdk.sdkReady$().subscribe(() => {
        this.playerSdk.connect(env.production ? PLAYER_NAME : `${PLAYER_NAME} Dev`, getAccessToken).subscribe();
      });
    }
    PLAYER_INSTANCES.add(this);
  }

  ngOnDestroy() {
    PLAYER_INSTANCES.delete(this);
    if (PLAYER_INSTANCES.size === 0) {
      this.playerSdk.disconnect();
    }
  }

  activate() {
    this.playerApi.transfer([this.playerSdk.deviceId], true).subscribe();
  }

  seek(distance: number) {
    this.playerSdk.getCurrentState()
      .pipe(
        filter(state => !!state),
        switchMap(state => this.playerSdk.seek(state.position + distance))
      )
      .subscribe();
  }

  toggleShuffle() {
    this.playerSdk.getCurrentState()
      .pipe(
        filter(state => !!state),
        switchMap(state => this.playerApi.shuffle(!state.shuffle)))
      .subscribe();
  }

  toggleRepeat() {
    this.playerSdk.getCurrentState()
      .pipe(
        filter(state => !!state),
        map(state => {
          switch (state.repeat_mode) {
          case RepearMode.No: return RepeatState.Context;
          case RepearMode.Once: return RepeatState.Off;
          case RepearMode.Full: return RepeatState.Track;
          default:
            const _: never = state.repeat_mode;
          }
        }),
        switchMap(state => this.playerApi.repeat(state))
      )
      .subscribe();
  }

  next() {
    this.playerSdk.getCurrentState()
      .pipe(
        filter(state => state && !state.disallows.skipping_next),
        switchMap(_ => this.playerSdk.nextTrack()),
      )
      .subscribe();
  }

  prev() {
    this.playerSdk.getCurrentState()
      .pipe(
        filter(state => state && !(state.disallows.skipping_prev && state.disallows.seeking)),
        switchMap(state => {
          return state.disallows.seeking || state.position < 2 * 1000 ?
            this.playerSdk.previousTrack() :
            this.playerSdk.seek(0);
        }),
      )
      .subscribe();
  }

}
