import { Component, OnInit } from '@angular/core';
import { SearchResolvedData } from '../search.resolver';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'sp-search-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss'],
})
export class ArtistComponent implements OnInit {

  data?: SearchResolvedData;

  get artists() {
    return this.data && this.data.result && this.data.result.artists;
  }

  get noResult() {
    return this.data && !this.data.result;
  }

  get notFound() {
    if (!this.data || !this.data.result) {
      return false;
    }

    return (this.artists && this.artists.total) * 1 === 0;
  }

  constructor(private route: ActivatedRoute, private page: SearchService) {}

  ngOnInit() {
    this.page.pathType = 'artist';
    this.route.parent.data.subscribe(data => this.data = data.data);
  }

}
