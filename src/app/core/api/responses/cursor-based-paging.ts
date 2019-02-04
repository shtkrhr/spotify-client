export interface Cursor {
  after: string;
}

export interface CursorBasedPaging<TItem> {
  items: TItem[];
  href: string;
  limit: number;
  next: string | null;
  total: number;
  cursors: Cursor;
}
