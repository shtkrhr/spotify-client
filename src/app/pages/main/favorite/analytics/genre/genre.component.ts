import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenreResolvedData } from './genre.resolver';
import { BarChartDatum } from '../../../../../core/ui/bar-chart/bar-chart.component';

// @todo: 曲数による重み付け

@Component({
  selector: 'sp-favorite-analytics-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
})
export class GenreComponent implements OnInit {

  data?: GenreResolvedData;

  displayedCount = 10;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(data => this.data = data.data);
  }

  onGenreClick(datum: BarChartDatum) {
    const genre = datum.id;
    this.displayedCount = 10;
    this.router.navigate(['./'], {
      queryParams: {genre},
      relativeTo: this.route,
    });
  }

  toggleDisplayedCount() {
    this.displayedCount = this.displayedCount ? undefined : 10;
  }

}
