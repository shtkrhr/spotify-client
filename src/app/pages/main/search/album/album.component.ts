import { Component, OnInit } from '@angular/core';
import { SearchResolvedData } from '../search.resolver';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'sp-search-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {

  data?: SearchResolvedData;

  get albums() {
    return this.data && this.data.result && this.data.result.albums;
  }

  get noResult() {
    return this.data && !this.data.result;
  }

  get notFound() {
    if (!this.data || !this.data.result) {
      return false;
    }

    return (this.albums && this.albums.total) * 1 === 0;
  }

  constructor(private route: ActivatedRoute, private page: SearchService) {}

  ngOnInit() {
    this.page.pathType = 'album';
    this.route.parent.data.subscribe(data => this.data = data.data);
  }

}
