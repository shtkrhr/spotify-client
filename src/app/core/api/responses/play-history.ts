import { TrackSimplified } from './track';
import { Context } from './playing-context';

export interface PlayHistory {
  track: TrackSimplified;
  played_at: string;
  context: Context;
}
