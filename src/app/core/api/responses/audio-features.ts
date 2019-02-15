import { Key } from './key';

export interface AudioFeatures extends CalculableFeatures {
  id: string;
  uri: string;
  track_href: string;
  analysis_url: string;
  type: 'audio_features';
  key: Key;
  mode: 0 | 1;
}

export interface CalculableFeatures {
  duration_ms: number;
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

export const emptyCalculable = () => {
  return {
    duration_ms: 0, time_signature: 0, acousticness: 0, danceability: 0, energy: 0,
    instrumentalness: 0, liveness: 0, loudness: 0, speechiness: 0, valence: 0, tempo: 0,
  };
};

export const aveFeatures = (list: CalculableFeatures[]) => {
  const result = emptyCalculable();
  if (list.length === 0) {
    return result;
  }

  const keys = Object.keys(result);
  const length = list.length;

  list.forEach(features => {
    keys.forEach(key => result[key] += features[key]);
  });
  keys.forEach(key => result[key] /= length);

  return result;
};

export const maxFeatures = (list: CalculableFeatures[]) => {
  const result = emptyCalculable();
  if (list.length === 0) {
    return result;
  }

  Object.keys(result).forEach(key => {
    result[key] = Math.max(...list.map(f => f[key]));
  });

  return result;
};

export const minFeatures = (list: CalculableFeatures[]) => {
  const result = emptyCalculable();
  if (list.length === 0) {
    return result;
  }

  Object.keys(result).forEach(key => {
    result[key] = Math.min(...list.map(f => f[key]));
  });

  return result;
};
