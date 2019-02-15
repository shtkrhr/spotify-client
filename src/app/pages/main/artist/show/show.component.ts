import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowResolvedData } from './show.resolver';
import { ArtistService } from '../../../../core/api/artist.service';

@Component({
  selector: 'sp-artist-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {

  data?: ShowResolvedData;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.data = data.data);
  }

}
