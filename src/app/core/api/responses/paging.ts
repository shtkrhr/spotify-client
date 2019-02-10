export interface Paging<TItem> extends PagingBase<TItem> {
  previous: string | null;
  offset: number;
}

export interface CursorBasedPaging<TItem> extends PagingBase<TItem> {
  cursors: Cursor;
}

export interface Cursor {
  after: string;
  before?: string;
}

interface PagingBase<TItem> {
  items: TItem[];
  href: string;
  limit: number;
  next: string | null;
  total: number;
}
