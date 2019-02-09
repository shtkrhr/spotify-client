export interface PagingCollection<TItem> {
  total: number;
  completed: boolean;
  items: TItem[];
}
