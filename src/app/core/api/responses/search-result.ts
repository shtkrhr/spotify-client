import { Paging } from './paging';
import { Artist } from './artist';
import { AlbumSimplified } from './album';
import { Track } from './track';
import { PlaylistSimplified } from './playlist';

export interface SearchResult {
  artists?: Paging<Artist>;
  albums?: Paging<AlbumSimplified>;
  tracks?: Paging<Track>;
  playlists?: Paging<PlaylistSimplified>;
}
