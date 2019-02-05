import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Artist } from '../../api/responses/artist';

export type D3Selection = d3.Selection<d3.BaseType, any, d3.BaseType, any>;

export interface ArtistRelationDataSet {
  artist: Artist;
  relateds: Artist[];
  relations: [string, string][];
}

interface Point {
 x: number;
 y: number;
}

@Component({
  selector: 'sp-artist-relation-graph',
  templateUrl: './artist-relation-graph.component.html',
  styleUrls: ['./artist-relation-graph.component.scss'],
})
export class ArtistRelationGraphComponent implements OnInit, OnChanges {

  @Input()
  dataSet?: ArtistRelationDataSet;

  @Output('artistClick')
  artistClickEvent = new EventEmitter<Artist>();

  @ViewChild('svg')
  private svgElement: ElementRef;

  private $svg: D3Selection;

  private $objectsGroup: D3Selection;

  private $defs: D3Selection;

  constructor() {}

  ngOnInit() {
    this.$svg = d3.select(this.svgElement.nativeElement);
    this.$objectsGroup = this.$svg.select('.objects');
    this.$defs = this.$svg.select('.defs');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSet) {
      this.clearAllGraph();
      if (this.dataSet) {
        this.render(this.dataSet);
      }
    }
  }

  private clearAllGraph() {
    if (this.$objectsGroup) {
      this.$objectsGroup.selectAll('*').remove();
    }
    if (this.$defs) {
      this.$defs.selectAll('*').remove();
    }
  }

  private render(dataSet: ArtistRelationDataSet) {
    const points = new Map<string, Point>();
    points.set(dataSet.artist.id, {x: 50, y: 50});
    dataSet.relateds.forEach((related, i) => {
      points.set(related.id, this.point(360 * i / dataSet.relateds.length, 40));
    });

    dataSet.relations.forEach(relation => {
      const pointA = points.get(relation[0]);
      const pointB = points.get(relation[1]);
      if (!pointA || !pointB) {
        return;
      }

      this.$objectsGroup.append('line')
        .attr('x1', pointA.x + '%')
        .attr('y1', pointA.y + '%')
        .attr('x2', pointB.x + '%')
        .attr('y2', pointB.y + '%')
        .attr('stroke', 'rgba(0, 0, 0, 0.5)')
        .attr('stroke-width', '1%');
    });

    [dataSet.artist, ...dataSet.relateds].forEach((artist, i) => {
      const point = points.get(artist.id);
      if (!point) {
        return;
      }

      const circleR = i === 0 ? 18 : 6;
      const circle = this.$objectsGroup.append('circle')
        .attr('class', `artist-icon artist-icon-${artist.id}`)
        .attr('r', circleR + '%')
        .attr('cx', point.x + '%')
        .attr('cy', point.y + '%')
        .attr('stroke', 'grey')
        .style('transform-origin', `${point.x}% ${point.y}%`)
        .on('click', _ => this.artistClickEvent.emit(artist));

      if (!artist.images[0]) {
        return;
      }
      const imageId = `artist-image-${artist.id}`;

      circle.attr('fill', `url(#${imageId})`);

      const $pattern = this.$defs.append('pattern')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('id', imageId);

      const baseSize = Math.min(artist.images[0].width, artist.images[0].height);
      const imageWidth = artist.images[0].width * circleR * 2 / baseSize;
      const imageHeight = artist.images[0].height * circleR * 2 / baseSize;
      const imageX = point.x - (imageWidth / 2);
      const imageY = point.y - (imageHeight / 2);
      $pattern.append('image')
        .attr('width', imageWidth + '%')
        .attr('height', imageHeight + '%')
        .attr('x', imageX + '%')
        .attr('y', imageY + '%')
        .attr('xlink:href', artist.images[0].url);
    });
  }

  private point(degree: number, r: number = 1): Point {
    const radian = degree * Math.PI / 180;
    const x = r * Math.sin(radian);
    const y = r * Math.cos(radian) * -1;
    return {
      x: 50 + Math.round(x * 100) / 100,
      y: 50 + Math.round(y * 100) / 100,
    };
  }
}
