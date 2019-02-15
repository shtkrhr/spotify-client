import { msToHHMMSS } from '../../util/util';

export enum FeaturesChartAxisType {
  Duration = 'Duration',
  TimeSignature = 'Time Signature',
  Acousticness = 'Acousticness',
  Danceability = 'Danceability',
  Energy = 'Energy',
  Instrumentalness = 'Instrumentalness',
  Liveness = 'Liveness',
  Loudness = 'Loudness',
  Speechiness = 'Speechiness',
  Valence = 'Valence',
  Tempo = 'Tempo',
}

export const allFeaturesChartAxisTypes = () => {
  return [
    FeaturesChartAxisType.Duration, FeaturesChartAxisType.TimeSignature, FeaturesChartAxisType.Acousticness,
    FeaturesChartAxisType.Danceability, FeaturesChartAxisType.Energy, FeaturesChartAxisType.Instrumentalness,
    FeaturesChartAxisType.Liveness, FeaturesChartAxisType.Loudness, FeaturesChartAxisType.Speechiness,
    FeaturesChartAxisType.Valence, FeaturesChartAxisType.Tempo
  ];
};

export interface FeaturesChartAxisConfig {
    name: string;
    key: string;
    unit?: string;
    format?: (v: number) => string;
}

export const configForFeaturesAxis = (axis: FeaturesChartAxisType): FeaturesChartAxisConfig => {
  switch (axis) {
  case FeaturesChartAxisType.Duration:
    return {
      name: FeaturesChartAxisType.Duration,
      key: 'duration_ms',
      format: msToHHMMSS,
    };
  case FeaturesChartAxisType.TimeSignature:
    return {
      name: FeaturesChartAxisType.TimeSignature,
      key: 'time_signature',
    };
  case FeaturesChartAxisType.Acousticness:
    return {
      name: FeaturesChartAxisType.Acousticness,
      key: 'acousticness',
    };
  case FeaturesChartAxisType.Danceability:
    return {
      name: FeaturesChartAxisType.Danceability,
      key: 'danceability',
    };
  case FeaturesChartAxisType.Energy:
    return {
      name: FeaturesChartAxisType.Energy,
      key: 'energy',
    };
  case FeaturesChartAxisType.Instrumentalness:
    return {
      name: FeaturesChartAxisType.Instrumentalness,
      key: 'instrumentalness',
    };
  case FeaturesChartAxisType.Liveness:
    return {
      name: FeaturesChartAxisType.Liveness,
      key: 'liveness',
    };
  case FeaturesChartAxisType.Loudness:
    return {
      name: FeaturesChartAxisType.Loudness,
      key: 'loudness',
      unit: 'db',
    };
  case FeaturesChartAxisType.Speechiness:
    return {
      name: FeaturesChartAxisType.Speechiness,
      key: 'speechiness',
    };
  case FeaturesChartAxisType.Valence:
    return {
      name: FeaturesChartAxisType.Valence,
      key: 'valence',
    };
  case FeaturesChartAxisType.Tempo:
    return {
      name: FeaturesChartAxisType.Tempo,
      key: 'tempo',
    };
  default:
    const _: never = axis;
  }
};

