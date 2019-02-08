import { Image } from './image';
import { ExternalUrl } from './external';
import { Followers } from './followers';

export interface Artist extends ArtistSimplified {
  genres: string[];
  popularity: number;
  images: Image[];
  followers: Followers;
}

export interface ArtistSimplified {
  id: string;
  name: string;
  href: string;
  type: 'artist';
  uri: string;
  external_urls: ExternalUrl;
}
