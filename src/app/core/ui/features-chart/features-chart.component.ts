import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { AudioFeatures, emptyCalculable, maxFeatures, minFeatures } from '../../api/responses/audio-features';
import { configForFeaturesAxis, FeaturesChartAxisType } from './features-chart-axis-type';
import { BehaviorSubject, ReplaySubject, Subject, timer } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';
import { onResize } from '../../util/util';

export type D3Selection = d3.Selection<d3.BaseType, any, d3.BaseType, any>;

const MARGIN = {
  top: 0,
  right: 0,
  bottom: 40,
  left: 70,
};

@Component({
  selector: 'sp-features-chart',
  templateUrl: './features-chart.component.html',
  styleUrls: ['./features-chart.component.scss'],
})
export class FeaturesChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  featuresList: AudioFeatures[] = [];

  @Input()
  xAxisType = FeaturesChartAxisType.Loudness;

  @Input()
  yAxisType = FeaturesChartAxisType.Tempo;

  @Output('dataSelect')
  dataSelectEvent = new EventEmitter<AudioFeatures[]>();

  @ViewChild('svg') private svgElement: ElementRef;
  @ViewChild('chartArea') private chartArea: ElementRef;
  @ViewChild('dataGroup') private dataGroup: ElementRef;
  @ViewChild('selectedDataGroup') private selectedDataGroup: ElementRef;
  @ViewChild('xAxisGroup') private xAxisGroup: ElementRef;
  @ViewChild('yAxisGroup') private yAxisGroup: ElementRef;
  @ViewChild('xAxisMetaGroup') private xAxisMetaGroup: ElementRef;
  @ViewChild('yAxisMetaGroup') private yAxisMetaGroup: ElementRef;

  private $svg: D3Selection;
  private $chartArea: D3Selection;
  private $dataGroup: D3Selection;
  private $selectedDataGroup: D3Selection;
  private $xAxisGroup: D3Selection;
  private $yAxisGroup: D3Selection;
  private $xAxisMetaGroup: D3Selection;
  private $yAxisMetaGroup: D3Selection;

  private xScale = d3.scaleLinear();
  private yScale = d3.scaleLinear();
  private xAxis = d3.axisBottom(this.xScale);
  private yAxis = d3.axisLeft(this.yScale);

  private destroyEvent = new Subject<void>();

  private maxFeatures = emptyCalculable();
  private minFeatures = emptyCalculable();

  private inited = false;

  get xAxisConfig() {
    return configForFeaturesAxis(this.xAxisType);
  }
  get yAxisConfig() {
    return configForFeaturesAxis(this.yAxisType);
  }

  private selectedFeatures$ = new BehaviorSubject<AudioFeatures[]>([]);

  constructor(private host: ElementRef) {}

  ngOnInit() {
    this.inited = true;

    onResize().pipe(
      debounce(_ => timer(50)),
      takeUntil(this.destroyEvent),
    ).subscribe(this.onResize.bind(this));

    this.$svg = d3.select(this.svgElement.nativeElement);
    this.$chartArea = d3.select(this.chartArea.nativeElement);
    this.$dataGroup = d3.select(this.dataGroup.nativeElement);
    this.$selectedDataGroup = d3.select(this.selectedDataGroup.nativeElement);
    this.$xAxisGroup = d3.select(this.xAxisGroup.nativeElement);
    this.$yAxisGroup = d3.select(this.yAxisGroup.nativeElement);
    this.$xAxisMetaGroup = d3.select(this.xAxisMetaGroup.nativeElement);
    this.$yAxisMetaGroup = d3.select(this.yAxisMetaGroup.nativeElement);

    this.$chartArea
      .style('transform', `translate(${MARGIN.left}px, 0)`)
      .attr('transform', `translate(${MARGIN.left}, 0)`);

    this.selectedFeatures$.subscribe(featuresList => {
      this.dataSelectEvent.next(featuresList);
      this.renderSelected(this.selectedFeatures$.value);
    });

    this.updateAxisMeta();
    this.updateLayout();
    this.callAxis();
    this.renderData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.featuresList) {
      this.maxFeatures = maxFeatures(this.featuresList || []);
      this.minFeatures = minFeatures(this.featuresList || []);
    }
    const xConfig = this.xAxisConfig;
    const yConfig = this.yAxisConfig;
    const xMin = this.minFeatures[xConfig.key];
    const xMax = this.maxFeatures[xConfig.key];
    const yMin = this.minFeatures[yConfig.key];
    const yMax = this.maxFeatures[yConfig.key];
    this.xScale.domain([xMin - ((xMax - xMin) / 8), xMax + ((xMax - xMin) / 8)]);
    this.yScale.domain([yMin - ((yMax - yMin) / 8), yMax + ((yMax - yMin) / 8)]);

    if (!this.inited) {
      return;
    }

    if (changes.xAxisType || changes.yAxisType) {
      this.updateAxisMeta();
    }
    this.updateLayout();
    this.callAxis();
    this.renderData();

    this.selectedFeatures$.next([]);
  }

  ngOnDestroy() {
    this.destroyEvent.next();
    this.destroyEvent.complete();
  }

  onResize() {
    if (!this.inited) {
      return;
    }
    this.updateLayout();
    this.callAxis();
    this.renderData();
    this.renderSelected(this.selectedFeatures$.value);
  }

  private updateAxisMeta() {
    const xConfig = this.xAxisConfig;
    const yConfig = this.yAxisConfig;
    this.$xAxisMetaGroup.select('text').text(xConfig.unit ? `${xConfig.name} [${xConfig.unit}]` : xConfig.name);
    this.$yAxisMetaGroup.select('text').text(yConfig.unit ? `${yConfig.name} [${yConfig.unit}]` : yConfig.name);
  }

  private callAxis() {
    const xConfig = this.xAxisConfig;
    const yConfig = this.yAxisConfig;
    this.$xAxisGroup.call(this.xAxis.tickFormat(xConfig.format || (d => d + '')));
    this.$yAxisGroup.call(this.yAxis.tickFormat(yConfig.format || (d => d + '')));
  }

  private renderData() {
    const xKey = this.xAxisConfig.key;
    const yKey = this.yAxisConfig.key;
    this.$dataGroup.selectAll('*').remove();
    this.$dataGroup.selectAll('circle')
      .data(this.featuresList || []).enter().append('circle')
      .attr('r', 6)
      .attr('cx', d => this.xScale(d[xKey]))
      .attr('cy', d => this.yScale(d[yKey]))
      .style('fill', 'rgba(0,0,0,0.7)')
      .on('click', d => {
        this.selectedFeatures$.next(
          this.featuresList.filter(v => v.id === d.id || (v[xKey] === d[xKey] && v[yKey] === d[yKey]))
        );
      });
  }

  private renderSelected(featuresList: AudioFeatures[]) {
    const xKey = this.xAxisConfig.key;
    const yKey = this.yAxisConfig.key;
    this.$selectedDataGroup.selectAll('*').remove();
    this.$selectedDataGroup.selectAll('circle')
      .data(featuresList).enter().append('circle')
      .attr('r', 8)
      .attr('cx', d => this.xScale(d[xKey]))
      .attr('cy', d => this.yScale(d[yKey]))
      .style('fill', 'transparent')
      .attr('stroke', 'orange')
      .attr('stroke-width', 2);
  }

  private updateLayout() {
    const clientWidth = this.host.nativeElement.clientWidth;
    const clientHeight = this.host.nativeElement.clientHeight;
    const chartWidth = clientWidth - MARGIN.left - MARGIN.right;
    const chartHeight = clientHeight - MARGIN.top - MARGIN.bottom;

    this.xScale.range([0, chartWidth] as ReadonlyArray<number>);
    this.yScale.range([chartHeight, 0] as ReadonlyArray<number>);

    this.$xAxisMetaGroup
      .style('transform', `translate(${MARGIN.left + (chartWidth / 2)}px, ${clientHeight}px)`)
      .attr('transform', `translate(${MARGIN.left + (chartWidth / 2)}, ${clientHeight})`);

    this.$yAxisMetaGroup
      .style('transform', `translate(7px, ${MARGIN.top + (chartHeight / 2)}px) rotate(90deg)`)
      .attr('transform', `translate(7, ${MARGIN.top + (chartHeight / 2)}) rotate(90)`);

    this.$xAxisGroup
      .style('transform', `translate(0, ${chartHeight}px)`)
      .attr('transform', `translate(0, ${chartHeight})`);
  }
}
