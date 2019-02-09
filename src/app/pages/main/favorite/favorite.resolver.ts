import { Resolve, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { LibraryService } from '../../../core/api/library.service';
import { SavedTrack } from '../../../core/api/responses/track';
import { PagingCollection } from '../../../core/api/responses/paging-collection';

export interface FavoriteResolvedData {
  tracksCollection$: Observable<PagingCollection<SavedTrack>>;
}

@Injectable()
export class FavoriteResolver implements Resolve<FavoriteResolvedData> {

  constructor(private router: Router, private libApi: LibraryService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    const subject = new ReplaySubject<PagingCollection<SavedTrack>>(1);
    this.libApi.allTracks().subscribe(subject.next.bind(subject));
    return {tracksCollection$: subject.asObservable()};
  }
}
