import { Device } from './device';
import { ExternalUrl } from './external';
import { Track } from './track';

export interface PlayingContext extends CurrentlyPlaying {
  device: Device;
  shuffle_state: boolean;
  repeat_state: RepeatState;
}

export interface CurrentlyPlaying {
  timestamp: number;
  item?: Track;
  progress_ms?: number;
  is_playing: boolean;
  context?: Context;
  currently_playing_type: PlayingType;
}

export interface Context {
  uri: string;
  href: string;
  type: 'album' | 'artist' | 'playlist';
  external_urls: ExternalUrl;
}

export enum PlayingType {
  Track = 'track',
  Episode = 'episode',
  Ad = 'ad',
  Unknown = 'unknown',
}

export enum RepeatState {
  Off = 'off',
  Track = 'track',
  Context = 'context',
}
