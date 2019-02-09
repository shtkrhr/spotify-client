import { Key } from './key';

export interface AudioFeatures {
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  type: 'audio_features';
  duration_ms: number;
  key: Key;
  mode: 0 | 1;
  time_signature: number;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  valence: number;
  tempo: number;
}
