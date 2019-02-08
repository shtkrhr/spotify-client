import { ArtistSimplified } from './artist';
import { ExternalId, ExternalUrl } from './external';
import { Image } from './image';
import { Copyright } from './copyright';
import { Paging } from './paging';
import { TrackSimplified } from './track';

export interface Album extends AlbumBase {
  label: string;
  copyrights: Copyright[];
  external_ids: ExternalId;
  genres: string[];
  popularity: number;
  tracks: Paging<TrackSimplified>;
}

export interface AlbumSimplified extends AlbumBase {
  album_group: 'album' | 'single' | 'compilation' | 'appears_on';
}

interface AlbumBase {
  id: string;
  name: string;
  href: string;
  album_type: 'album' | 'single' | 'compilation';
  artists: ArtistSimplified[];
  available_markets: string[];
  external_urls: ExternalUrl;
  images: Image[];
  release_date: string;
  release_date_precision: string;
  type: 'album';
  uri: string;
  // restrictions
}
