import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchResolvedData } from '../search.resolver';
import { SearchService } from '../search.service';

@Component({
  selector: 'sp-search-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
})
export class TrackComponent implements OnInit {

  data?: SearchResolvedData;

  get tracks() {
    return this.data && this.data.result && this.data.result.tracks;
  }

  get noResult() {
    return this.data && !this.data.result;
  }

  get notFound() {
    if (!this.data || !this.data.result) {
      return false;
    }

    return (this.tracks && this.tracks.total) * 1 === 0;
  }

  constructor(private route: ActivatedRoute,
              private page: SearchService) {}

  ngOnInit() {
    this.page.pathType = 'track';
    this.route.parent.data.subscribe(data => this.data = data.data);
  }

}
