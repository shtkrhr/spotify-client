import { ExternalUrl } from './external';
import { Followers } from './followers';
import { Image } from './image';

export interface User {
  id: string;
  display_name: string;
  href: string;
  images: Image[];
  external_urls: ExternalUrl;
  followers: Followers;
  type: 'user';
  uri: string;
}
