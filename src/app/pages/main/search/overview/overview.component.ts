import { Component, OnInit } from '@angular/core';
import { SearchResolvedData } from '../search.resolver';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'sp-search-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {

  data?: SearchResolvedData;

  get artists() {
    return this.data && this.data.result && this.data.result.artists;
  }
  get albums() {
    return this.data && this.data.result && this.data.result.albums;
  }
  get tracks() {
    return this.data && this.data.result && this.data.result.tracks;
  }
  get playlists() {
    return this.data && this.data.result && this.data.result.playlists;
  }

  get noResult() {
    return this.data && !this.data.result;
  }

  get notFound() {
    if (!this.data || !this.data.result) {
      return false;
    }
    const total =
      (this.artists && this.artists.total) * 1 +
      (this.albums && this.albums.total) * 1 +
      (this.tracks && this.tracks.total) * 1 +
      (this.playlists && this.playlists.total) * 1;

    return total === 0;
  }

  constructor(private route: ActivatedRoute, private page: SearchService) {}

  ngOnInit() {
    this.page.pathType = 'overview';
    this.route.parent.data.subscribe(data => this.data = data.data);
  }

}
