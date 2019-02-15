import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OverviewResolvedData } from './overview.resolver';

@Component({
  selector: 'sp-artist-show-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {

  data?: OverviewResolvedData;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.data = data.data);
  }

}
