import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { IndexResolvedData } from './index.resolver';
import { Artist } from '../../../../core/api/responses/artist';

@Component({
  selector: 'sp-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

  readonly data$ = new ReplaySubject<IndexResolvedData>(1);

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.data$.next(data.data);
    });
  }

  onArtistClick(artist: Artist) {
    return this.router.navigate(['/artist', artist.id]);
  }

}
