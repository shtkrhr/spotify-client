import { Component, OnInit } from '@angular/core';
import { ShowResolvedData } from './show.resolver';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sp-playlist-show',
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
