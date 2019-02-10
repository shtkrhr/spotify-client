import { Injectable } from '@angular/core';
import { AsyncSubject, from, Observable, Subject } from 'rxjs';
import { Player, WebPlaybackError, WebPlaybackPlayer, WebPlaybackState } from './player';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {

  get isSdkReady() {
    return this._isSdkReady;
  }
  get deviceId() {
    return this._deviceId;
  }

  get sdkReady$() {
    return this._sdkReady$.asObservable();
  }

  get ready$() {
    return this._ready$.asObservable();
  }
  get notReady$() {
    return this._notReady$.asObservable();
  }
  get playerStateChanged$() {
    return this._playerStateChanged$.asObservable();
  }
  get initializationError$() {
    return this._initializationError$.asObservable();
  }
  get authenticationError$() {
    return this._authenticationError$.asObservable();
  }
  get accountError$() {
    return this._accountError$.asObservable();
  }
  get playbackError$() {
    return this._playbackError$.asObservable();
  }

  private _isSdkReady = false;
  private _deviceId?: string;
  private player?: Player;

  private _sdkReady$ = new AsyncSubject();

  private _ready$ = new Subject<WebPlaybackPlayer>();
  private _notReady$ = new Subject<WebPlaybackPlayer>();
  private _playerStateChanged$ = new Subject<WebPlaybackState>();
  private _initializationError$ = new Subject<WebPlaybackError>();
  private _authenticationError$ = new Subject<WebPlaybackError>();
  private _accountError$ = new Subject<WebPlaybackError>();
  private _playbackError$ = new Subject<WebPlaybackError>();

  private eventListeners = {
    ready: (res) => {
      this._deviceId = res.device_id;
      this._ready$.next(res);
    },
    not_ready: this._notReady$.next.bind(this._notReady$),
    player_state_changed: this._playerStateChanged$.next.bind(this._playerStateChanged$),
    initialization_error: this._initializationError$.next.bind(this._initializationError$),
    authentication_error: this._authenticationError$.next.bind(this._authenticationError$),
    account_error: this._accountError$.next.bind(this._accountError$),
    playback_error: this._playbackError$.next.bind(this._playbackError$),
  };

  constructor() {
    window['onSpotifyWebPlaybackSDKReady'] = () => {
      this._isSdkReady = true;
      this._sdkReady$.next(true);
      this._sdkReady$.complete();
    };

    const script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onerror = () => {
      throw new Error('Failed to load player SDK script.');
    };

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  connect(name: string, getAccessToken: () => string): Observable<boolean> {
    this.disconnect();
    const params = {name, getOAuthToken: cb => cb(getAccessToken())};
    const player = new window['Spotify']['Player'](params);

    Object.keys(this.eventListeners).forEach(eventName => {
      player.addListener(eventName, this.eventListeners[eventName]);
    });

    return from(player.connect()).pipe(tap(connected => {
      this.player = connected ? player : undefined;
    }));
  }

  disconnect() {
    if (!this.player) {
      return;
    }
    Object.keys(this.eventListeners)
      .forEach(eventName => this.player.removeListener(eventName));
    this.player.disconnect();
    this.player = undefined;
    this._deviceId = undefined;
  }

  getCurrentState(): Observable<WebPlaybackState | undefined> {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.getCurrentState());
  }

  setName(name: string): Observable {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.setName());
  }

  getVolume(): Observable<number> {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.getVolume());
  }

  setVolume(volume: number): Observable {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.setVolume(volume / 100));
  }

  pause(): Observable {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.pause());
  }

  resume(): Observable {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.resume());
  }

  togglePlay(): Observable {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.togglePlay());
  }

  seek(position: number): Observable {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.seek(position));
  }

  previousTrack(): Observable {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.previousTrack());
  }

  nextTrack(): Observable {
    if (!this.player) {
      throw new Error;
    }
    return from(this.player.nextTrack());
  }

}
