import { ExternalUrl } from './external-url';
import { Followers } from './followers';
import { Image } from './image';

export interface User {
  id: string;
  display_name: string;
  href: string;
  type: 'user';
  uri: string;
  images: Image[];
  external_urls: ExternalUrl;
  followers: Followers;
}
