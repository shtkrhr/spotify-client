import { SearchRequestParams, SearchType } from '../request-params/search';
import { removeEmptyKey } from '../../util/util';

export interface SearchParams {
  q?: string;
  excepteds?: string[];
  genres?: string[];
  year?: {
    start: number;
    end: number;
  };
  types?: SearchType[];
  limit?: number;
  offset?: number;
}

export const isValidSearchParams = (p: SearchParams): boolean => {
  if (!p.q && (!p.excepteds || p.excepteds.length === 0) && (!p.genres || p.genres.length === 0) && !p.year) {
    return false;
  }

  if (p.year && (p.year.start < 0 || p.year.end < 0)) {
    return false;
  }

  return true;
};

export const toSearchRequestParams = (p: SearchParams): SearchRequestParams => {
  const types = p.types && p.types.length > 0 ? p.types : ['artist', 'album', 'track', 'playlist'];
  const excepteds = (p.excepteds || [] as string[]).map(v => `NOT ${v}`).join(' ');
  const genre = (p.genres || [] as string[]).map(g => `genre:"${g}"`).join(' ');
  const year = p.year ? (p.year.start === p.year.end ? `year:${p.year.start}` : `year:${p.year.start}-${p.year.end}`) : '';
  const _q = (() => {
    let result = p.q || '';
    if (p.year) {
      result = result.replace(/year\:[0-9]{1,4}(\-[0-9]{1,4})?/g, '');
    }
    return result;
  })();
  const q = [_q, excepteds, genre, year].filter(v => !!v).join(' ');

  return removeEmptyKey({
    q,
    type: types.join(','),
    limit: p.limit || 50,
    offset: p.offset,
  });
};
