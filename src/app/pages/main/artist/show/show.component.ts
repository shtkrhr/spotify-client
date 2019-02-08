import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ShowResolvedData } from './show.resolver';
import { ArtistService } from '../../../../core/api/artist.service';
import { Artist } from '../../../../core/api/responses/artist';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sp-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {

  readonly data$ = new ReplaySubject<ShowResolvedData>(1);

  readonly extarnals$ = this.data$.pipe(map(data => {
    return Object.keys(data.artist.external_urls).map(title => ({title, url: data.artist.external_urls[title]}));
  }));

  constructor(private route: ActivatedRoute, private artistApi: ArtistService, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.data$.next(data.data);
    });
  }

  onArtistClick(artist: Artist) {
    this.router.navigate(['/artist', artist.id]);
  }

}
