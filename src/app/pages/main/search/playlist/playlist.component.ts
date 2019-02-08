import { Component, OnInit } from '@angular/core';
import { SearchResolvedData } from '../search.resolver';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'sp-search-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {

  data?: SearchResolvedData;

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

    return (this.playlists && this.playlists.total) * 1 === 0;
  }

  constructor(private route: ActivatedRoute, private page: SearchService) {}

  ngOnInit() {
    this.page.pathType = 'playlist';
    this.route.parent.data.subscribe(data => this.data = data.data);
  }

}
