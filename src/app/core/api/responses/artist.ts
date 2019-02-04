import { Image } from './image';
import { ExternalUrl } from './external-url';
import { Followers } from './followers';

export interface Artist {
  id: string;
  href: string;
  genres: string[];
  popularity: number;
  type: 'artist';
  uri: string;
  images: Image[];
  external_urls: ExternalUrl;
  followers: Followers;
}
