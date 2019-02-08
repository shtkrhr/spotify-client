export type SearchType = 'artist' | 'album' | 'track' | 'playlist';

export interface SearchRequestParams {
  q: string;
  type: string;
  market?: string;
  limit?: number;
  offset?: number;
  include_external?: 'audio';
}
