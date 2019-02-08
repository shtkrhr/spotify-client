import { ExternalUrl } from './external';
import { Followers } from './followers';
import { Image } from './image';
import { Track } from './track';
import { Paging } from './paging';
import { User } from './user';

export interface Playlist extends PlaylistBase {
  description: string;
  followers: Followers;
  tracks: Paging<PlaylistTrack>;
}

export interface PlaylistSimplified extends PlaylistBase {
  tracks: {
    href: string;
    total: number;
  };
}

export interface PlaylistTrack {
  added_at: string | null;
  added_by: User;
  is_local: boolean;
  track: Track;
}

export interface PlaylistBase {
  id: string;
  name: string;
  href: string;
  collaborative: boolean;
  external_urls: ExternalUrl;
  images: Image[];
  owner: User;
  public: boolean;
  snapshot_id: string;
  type: 'playlist';
  uri: string;
}
