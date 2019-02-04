import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { IndexResolvedData } from './index.resolver';

@Component({
  selector: 'sp-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

  readonly data = new ReplaySubject<IndexResolvedData>(1);

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.data.next(data.data);
    });
  }

}
