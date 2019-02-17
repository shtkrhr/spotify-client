import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Subject, timer } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';
import { onResize } from '../../util/util';

export type D3Selection = d3.Selection<d3.BaseType, any, d3.BaseType, any>;

const PADDING = {
  top: 30,
  right: 0,
  bottom: 0,
  left: 150,
};

const BAR_HEIGHT = 26;
const BAR_GUTTER = 8;

export interface BarChartDatum {
  id: string;
  name?: string;
  value: number;
}

@Component({
  selector: 'sp-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  data?: BarChartDatum[] = [];

  @Input()
  displayedCount?: number;

  @Input()
  showOthers = true;

  @Output('datumClick')
  datumClickEvent = new EventEmitter<BarChartDatum>();

  @ViewChild('svg') private svgElement: ElementRef;
  @ViewChild('chartArea') private chartArea: ElementRef;
  @ViewChild('dataGroup') private dataGroup: ElementRef;
  @ViewChild('dataNamesGroup') private dataNamesGroup: ElementRef;
  @ViewChild('xAxisGroup') private xAxisGroup: ElementRef;

  private formatedData: BarChartDatum[] = [];

  private $svg: D3Selection;
  private $chartArea: D3Selection;
  private $dataGroup: D3Selection;
  private $dataNamesGroup: D3Selection;
  private $xAxisGroup: D3Selection;

  private xScale = d3.scaleLinear();
  private xAxis = d3.axisTop(this.xScale);

  private destroyEvent = new Subject<void>();

  private inited = false;

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
    this.$dataNamesGroup = d3.select(this.dataNamesGroup.nativeElement);
    this.$xAxisGroup = d3.select(this.xAxisGroup.nativeElement);

    this.$chartArea
      .style('transform', `translate(${PADDING.left}px, ${PADDING.top}px)`)
      .attr('transform', `translate(${PADDING.left}, ${PADDING.top})`);

    this.updateLayout();
    this.callAxis();
    this.renderData();
    this.setSvgHeight();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formatedData = this.formatData(this.data || [], this.showOthers, this.displayedCount);
    this.xScale.domain([0, d3.max(this.formatedData, d => d.value)]);

    if (!this.inited) {
      return;
    }
    this.updateLayout();
    this.callAxis();
    this.renderData();
    this.setSvgHeight();
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
    this.setSvgHeight();
  }

  private updateLayout() {
    const clientWidth = this.host.nativeElement.clientWidth;
    const chartWidth = clientWidth - PADDING.left - PADDING.right - 10;

    this.xScale.range([0, chartWidth] as ReadonlyArray<number>);
  }

  private callAxis() {
    this.$xAxisGroup.call(this.xAxis);
  }

  private renderData() {
    this.$dataGroup.selectAll('*').remove();
    this.$dataGroup.selectAll('rect')
      .data(this.formatedData).enter().append('rect')
      .attr('x', this.xScale(0))
      .attr('y', (d, i) => i * (BAR_HEIGHT + BAR_GUTTER) + BAR_GUTTER)
      .attr('width', d => this.xScale(d.value) - this.xScale(0))
      .attr('height', BAR_HEIGHT)
      .attr('class', d => `bar bar-${d.id}`)
      .style('fill', d => d.id === 'others' ? 'lightgrey' : 'black')
      .on('click', d => this.datumClickEvent.next(d));

    this.$dataNamesGroup.selectAll('*').remove();
    const $nameGroups = this.$dataNamesGroup.selectAll('g')
      .data(this.formatedData).enter().append('g')
      .attr('transform', (d, i) => `translate(${this.xScale(0)}, ${i * (BAR_HEIGHT + BAR_GUTTER) + BAR_GUTTER})`)
      .style('transform', (d, i) => `translate(${this.xScale(0)}px, ${i * (BAR_HEIGHT + BAR_GUTTER) + BAR_GUTTER}px)`)
      .attr('class', d => `name-group name-group-${d.id}`);
    $nameGroups.append('line')
      .attr('x1', 0)
      .attr('y1', BAR_HEIGHT / 2)
      .attr('x2', -10)
      .attr('y2', BAR_HEIGHT / 2)
      .attr('stroke', 'black');
    $nameGroups.append('text')
      .text(d => d.name || d.id)
      .attr('class', d => `name-text name-text-${d.id}`)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'central')
      .attr('transform', `translate(-14, ${BAR_HEIGHT / 2})`)
      .style('transform', `translate(-14px, ${BAR_HEIGHT / 2}px)`)
      ;
  }

  private setSvgHeight() {
    const chartHeight = this.formatedData.length * (BAR_HEIGHT + BAR_GUTTER);
    this.svgElement.nativeElement.style.height = `${chartHeight + PADDING.top + PADDING.bottom}px`;
  }

  private formatData(data: BarChartDatum[], showOthers: boolean, displayedCount?: number) {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const count = parseInt(displayedCount + '', 10);
    if (count <= 0 || isNaN(count)) {
      return sorted;
    }

    const sliced = sorted.slice(0, count);
    if (!showOthers) {
      return sliced;
    }

    const others = sorted.slice(count).reduce((carry, datum) => {
      carry.value += datum.value;
      return carry;
    }, {id: 'others', value: 0});

    return others.value > 0 ? sliced.concat([others]) : sliced;
  }

}
