import { AlbumSimplified } from './album';
import { ArtistSimplified } from './artist';
import { ExternalId, ExternalUrl } from './external';

export interface Track extends TrackSimplified {
  album: AlbumSimplified;
  external_ids: ExternalId;
  popularity: number;
}

export interface TrackSimplified {
  id: string;
  name: string;
  href: string;
  artists: ArtistSimplified[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrl;
  is_playable: boolean;
  linked_from: TrackLink;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
  // restrictions
}

export interface TrackLink {
  id: string;
  href: string;
  external_urls: ExternalUrl;
  type: 'track';
  uri: string;
}
