import { Observable, of, throwError } from 'rxjs';


interface CacheContent<T> {
  expiry: number; // ms
  value: T;
}

const isExpired = <T>(content: CacheContent<T>) => content.expiry < Date.now();

export class InMemoryCache<T> {

  private cache = new Map<string, CacheContent<T>>();

  constructor(private defaultMaxAge: number = 20 * 60) {}

  get(key: string): Observable<T> {
    if (!this.cache.has(key) || isExpired(this.cache.get(key))) {
      this.delete(key);
      return throwError('Requested key is not available in Cache');
    }

    return of(this.cache.get(key).value);
  }

  set(key: string, value: T, maxAge: number = this.defaultMaxAge) {
    this.cache.set(key, {value, expiry: maxAge * 1000 + Date.now()});
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}
