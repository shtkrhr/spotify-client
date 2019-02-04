import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { ShowResolvedData } from './show.resolver';

@Component({
  selector: 'sp-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {

  data = new ReplaySubject<ShowResolvedData>(1);

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(data.data);
      this.data.next(data.data);
    });
  }

}
