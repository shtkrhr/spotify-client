export interface Player {
  addListener(eventName: string, callback: (res: any) => void): void;
  removeListener(eventName: string, callback?: (res: any) => void): void;
  connect(): Promise<boolean>;
  disconnect(): void;
  getCurrentState(): Promise<WebPlaybackState | undefined>;
  setName(name: string): Promise;
  getVolume(): Promise<number>;
  setVolume(volume: number): Promise;
  pause(): Promise;
  resume(): Promise;
  togglePlay(): Promise;
  seek(position: number): Promise;
  previousTrack(): Promise;
  nextTrack(): Promise;
}

export interface WebPlaybackPlayer {
  device_id: string;
}

export interface WebPlaybackState {
  context: {
    uri?: string;
    metadata?: {[key: string]: any};
  };
  disallows: {                  // A simplified set of restriction controls for
    pausing: boolean;           // The current track. By default, these fields
    peeking_next: boolean;      // will either be set to false or undefined, which
    peeking_prev: boolean;      // indicates that the particular operation is
    resuming: boolean;          // allowed. When the field is set to `true`, this
    seeking: boolean;           // means that the operation is not permitted. For
    skipping_next: boolean;     // example, `skipping_next`, `skipping_prev` and
    skipping_prev: boolean;     // `seeking` will be set to `true` when playing an ad track.
  };
  paused: boolean;
  position: number;
  repeat_mode: RepearMode;
  shuffle: boolean;
  track_window: {
    current_track: WebPlaybackTrack;      // The track currently on local playback
    previous_tracks: WebPlaybackTrack[];  // Previously played tracks. Number can vary.
    next_tracks: WebPlaybackTrack[];      // Tracks queued next. Number can vary.
  };
}

export interface WebPlaybackTrack {
  uri: string;
  id?: string;
  type: 'track' | 'episode' | 'ad';
  media_type: 'audio' | 'video';
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: { url: string }[];
  };
  artists: { uri: string, name: string };
}

export interface WebPlaybackError {
  message: string;
}

export enum RepearMode {
  No, Once, Full,
}
