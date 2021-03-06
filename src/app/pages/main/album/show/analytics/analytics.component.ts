import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsResolvedData } from './analytics.resolver';
import { AudioFeatures } from '../../../../../core/api/responses/audio-features';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { Track } from '../../../../../core/api/responses/track';
import { TrackService } from '../../../../../core/api/track.service';
import { catchError } from 'rxjs/operators';
import { configForFeaturesAxis, FeaturesChartAxisType } from '../../../../../core/ui/features-chart/features-chart-axis-type';
import { FeaturesChartAxisSelectChangeEvent } from '../../../../../core/ui/features-chart-axis-select/features-chart-axis-select.component';

interface SelectedFeatureValues {
  x: {
    name: string;
    value: string;
  };
  y: {
    name: string;
    value: string;
  };
}

@Component({
  selector: 'sp-album-show-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {

  data?: AnalyticsResolvedData;

  xAxisType = FeaturesChartAxisType.Duration;
  yAxisType = FeaturesChartAxisType.Loudness;

  readonly selectedTracks$ = new BehaviorSubject<Track[] | undefined>(undefined);

  readonly selectedFeatureValues$ = new BehaviorSubject<SelectedFeatureValues | undefined>(undefined);

  constructor(private route: ActivatedRoute, private trackApi: TrackService) {}

  ngOnInit() {
    this.route.data.subscribe(data => this.data = data.data);
  }

  onSelect(list: AudioFeatures[]) {
    if (list.length === 0) {
      this.selectedTracks$.next(undefined);
      this.selectedFeatureValues$.next(undefined);
      return;
    }

    const xConfig = configForFeaturesAxis(this.xAxisType);
    const yConfig = configForFeaturesAxis(this.yAxisType);
    const values = {
      x: {
        name: xConfig.name,
        value: xConfig.format ?
          xConfig.format(list[0][xConfig.key]) :
          (xConfig.unit ? `${list[0][xConfig.key]} [${xConfig.unit}]` : list[0][xConfig.key]),
      },
      y: {
        name: yConfig.name,
        value: yConfig.format ?
          yConfig.format(list[0][yConfig.key]) :
          (yConfig.unit ? `${list[0][yConfig.key]} [${yConfig.unit}]` : list[0][yConfig.key]),
      },
    };
    this.selectedFeatureValues$.next(values);

    const observables = list.map(f => this.trackApi.show(f.id).pipe(catchError(_ => of(false))));
    combineLatest<Track | false>(observables).subscribe((tracks: any) => {
      this.selectedTracks$.next(tracks.filter(v => !!v) as Track[]);
    });
  }

  onAxisChange(event: FeaturesChartAxisSelectChangeEvent) {
    this.xAxisType = event.x;
    this.yAxisType = event.y;
    this.selectedTracks$.next(undefined);
    this.selectedFeatureValues$.next(undefined);
  }
}
