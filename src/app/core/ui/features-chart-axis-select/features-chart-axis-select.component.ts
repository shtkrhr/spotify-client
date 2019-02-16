import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { allFeaturesChartAxisTypes, FeaturesChartAxisType } from '../features-chart/features-chart-axis-type';

export interface FeaturesChartAxisSelectChangeEvent {
  x: FeaturesChartAxisType;
  y: FeaturesChartAxisType;
}

@Component({
  selector: 'sp-features-chart-axis-select',
  templateUrl: './features-chart-axis-select.component.html',
  styleUrls: ['./features-chart-axis-select.component.scss'],
})
export class FeaturesChartAxisSelectComponent implements OnInit {

  @Input()
  xAxisType = FeaturesChartAxisType.Duration;

  @Input()
  yAxisType = FeaturesChartAxisType.Tempo;

  @Output('axisChange')
  axisChangeEvent = new EventEmitter<FeaturesChartAxisSelectChangeEvent>();

  readonly allAxisTypes = allFeaturesChartAxisTypes();

  constructor() {}

  ngOnInit() {
  }

  onAxisChange() {
    this.axisChangeEvent.emit({
      x: this.xAxisType,
      y: this.yAxisType,
    });
  }

}
