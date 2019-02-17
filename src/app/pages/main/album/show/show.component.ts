import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShowResolvedData } from './show.resolver';

// @todo: release date

@Component({
  selector: 'sp-album-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {

  data?: ShowResolvedData;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => this.data = data.data);
  }

}
