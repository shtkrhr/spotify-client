import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../../core/api/library.service';
import { FavoriteResolvedData } from './favorite.resolver';

@Component({
  selector: 'sp-track-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {

  data?: FavoriteResolvedData;

  constructor(private route: ActivatedRoute, private libApi: LibraryService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.data = data.data;
    });
  }

  testFetch() {
    const observable = this.libApi.allTracks();

    console.log('start subsc 1');
    observable.subscribe(res => {
      console.log('recieved 1');
      console.log(res);
    });
    console.log('start subsc 2');
    observable.subscribe(res => {
      console.log('recieved 2');
      console.log(res);
    });

    // console.log('fetch start');
    // observable.subscribe(
    //   console.log,
    //   undefined,
    //   () => {
    //     console.log('completed and 1 more subscribe');
    //     observable.subscribe(console.log);
    //   }
    // );
  }

}
