import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { FollowingResolvedData } from './following.resolver';
import { Artist } from '../../../../core/api/responses/artist';

// @todo: ジャンルとかで絞り込み
// @todo: followしてないけど、お気に入りの曲があるアーティスト

@Component({
  selector: 'sp-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
})
export class FollowingComponent implements OnInit {

  readonly data$ = new ReplaySubject<FollowingResolvedData>(1);

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.data$.next(data.data);
    });
  }

  onArtistClick(artist: Artist) {
    this.router.navigate(['/artist', artist.id]);
  }

}
