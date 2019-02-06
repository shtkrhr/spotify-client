import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { Simulation } from 'd3';
import { Artist } from '../../api/responses/artist';
import { ArtistLink, ArtistNode, ArtistRelationDataSet, D3Selection, Range, LinkCountData } from './artist-relation-diagram.type';

// @todo: resize

const isSameLink = (a: ArtistLink, b: ArtistLink) => a.target === b.target && a.source === b.source;

const isMutualLink = (a: ArtistLink, b: ArtistLink) => a.target === b.source && a.source === b.target;

const onDragStart = (d: ArtistNode, simulation: Simulation<ArtistNode, ArtistLink>) => {
  if (!d3.event.active) {
    simulation.alphaTarget(0.3).restart();
  }
  d.fx = d.x;
  d.fy = d.y;
};

const onDrag = (d: ArtistNode) => {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
};

const onDragEnd = (d: ArtistNode, simulation: Simulation<ArtistNode, ArtistLink>) => {
  if (!d3.event.active) {
    simulation.alphaTarget(0);
  }
  d.fx = null;
  d.fy = null;
};

@Component({
  selector: 'sp-artist-relation-diagram',
  templateUrl: './artist-relation-diagram.component.html',
  styleUrls: ['./artist-relation-diagram.component.scss'],
})
export class ArtistRelationDiagramComponent implements OnInit, OnChanges {

  @Input()
  dataSet?: ArtistRelationDataSet;

  @Output('artistClick')
  artistClickEvent = new EventEmitter<Artist>();

  @ViewChild('svg')
  private svgElement: ElementRef;

  private $svg?: D3Selection;

  private $diagram?: D3Selection;

  private $defs?: D3Selection;

  private simulation?: Simulation<ArtistNode, ArtistLink>;

  constructor() {}

  ngOnInit() {
    this.$svg = d3.select(this.svgElement.nativeElement);
    this.$diagram = this.$svg.select('.diagram');
    this.$defs = this.$svg.select('.defs');
    if (this.dataSet) {
      this.render(this.dataSet);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSet) {
      this.clearAll();
      if (this.dataSet) {
        this.render(this.dataSet);
      }
    }
  }

  private clearAll() {
    if (this.$diagram) {
      this.$diagram.selectAll('*').remove();
    }
    if (this.$defs) {
      this.$defs.selectAll('*').remove();
    }
    this.simulation = undefined;
  }

  private cleanDataSet(dataSet: ArtistRelationDataSet): ArtistRelationDataSet {
    return {
      artists: dataSet.artists
        .map(a => Object.create(a)),
      links: dataSet.links
        .filter((l, i, self) => self.findIndex(_l => isSameLink(l, _l)) === i)
        .map(l => Object.create(l)),
    };
  }

  private linkCountData(dataSet: ArtistRelationDataSet) {
    const map = new Map<string, number>();
    dataSet.artists.forEach(a => {
      map.set(a.id, dataSet.links.filter(link => link.source === a.id || link.target === a.id).length);
    });

    const counts = Array.from(map.values()).sort((a, b) => a > b ? 1 : -1);

    return {
      map,
      min: counts.length > 0 ? counts[0] : 0,
      max: counts.length > 0 ? counts[counts.length - 1] : 0,
    };
  }

  private circleRMap(artists: Artist[], linkCounts: LinkCountData, circleRRange: Range) {
    const circleRMap = new Map<string, number>();
    artists.forEach(a => {
      if (linkCounts.max === linkCounts.min) {
        circleRMap.set(a.id, (circleRRange.max + circleRRange.min) / 2);
        return;
      }
      const count = linkCounts.map.get(a.id);
      const ratio = (count - linkCounts.min) / (linkCounts.max - linkCounts.min);
      circleRMap.set(a.id, (circleRRange.max - circleRRange.min) * ratio + circleRRange.min);
    });
    return circleRMap;
  }

  private render(dataSet: ArtistRelationDataSet) {
    if (!this.$svg || !this.$diagram || !this.$defs) {
      return;
    }
    dataSet = this.cleanDataSet(dataSet);
    const width = 1000;
    const height = width;
    const circleRRange = {
      min: width / 15 / 3,
      max: width / 15,
    };
    const linkCounts = this.linkCountData(dataSet);
    const circleRMap = this.circleRMap(dataSet.artists, linkCounts, circleRRange);

    this.$svg.style('width', width).style('height', height);

    const simulation = d3.forceSimulation<ArtistNode, ArtistLink>()
      .force('link', d3.forceLink<ArtistNode, ArtistLink>()
        .id(d => d.id)
        .distance(link => {
          const a = circleRMap.get((link.source as ArtistNode).id);
          const b = circleRMap.get((link.target as ArtistNode).id);
          return (a + b) * 2;
        })
      )
      .force('collide', d3.forceCollide<ArtistNode>()
        .radius(circleRRange.max)
        .strength(0.2)
      )
      .force('charge', d3.forceManyBody<ArtistNode>())
      .force('center', d3.forceCenter<ArtistNode>(width / 2, height / 2));

    const $clipPath = this.$defs.selectAll('clipPath')
      .data(dataSet.artists)
      .enter()
      .append('clipPath')
      .attr('id', d => `clip-path-${d.id}`)
      .append('circle')
      .attr('r', d => circleRMap.get(d.id));

    const $link = this.$diagram.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(dataSet.links)
      .enter().append('line')
      .attr('stroke-width', l => dataSet.links.find(_l => isMutualLink(l, _l)) ? 3 : 1);

    const $node = this.$diagram.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(dataSet.artists)
      .enter()
      .append('g')
      .attr('class', d => `node node-${d.id}`)
      .call(d3.drag()
        .on('start', (d: ArtistNode) => onDragStart(d, simulation))
        .on('drag', onDrag)
        .on('end', (d: ArtistNode) => onDragEnd(d, simulation))
      );

    $node.append('circle')
      .attr('r', d => circleRMap.get(d.id))
      .on('click', d => this.artistClickEvent.emit(d));
    $node.append('image')
      .attr('xlink:href',  d => d.images[0] ? d.images[0].url : '')
      .attr('x', d => circleRMap.get(d.id) * -1)
      .attr('y', d => circleRMap.get(d.id) * -1)
      .attr('height', d => circleRMap.get(d.id) * 2)
      .attr('width', d => circleRMap.get(d.id) * 2)
      .attr('clip-path', d => `url(#clip-path-${d.id})`);
    $node.append('text')
      .attr('class', d => `node-text node-text-${d.id}`)
      .text(d => d.name)
      .attr('x', d => circleRMap.get(d.id))
      .attr('y', d => circleRMap.get(d.id));

    simulation
      .nodes(dataSet.artists)
      .on('tick', () => {
        $link
          .attr('x1', d => Math.max(Math.min(width - circleRRange.max, (d.source as ArtistNode).x), circleRRange.max))
          .attr('y1', d => Math.max(Math.min(width - circleRRange.max, (d.source as ArtistNode).y), circleRRange.max))
          .attr('x2', d => Math.max(Math.min(width - circleRRange.max, (d.target as ArtistNode).x), circleRRange.max))
          .attr('y2', d => Math.max(Math.min(width - circleRRange.max, (d.target as ArtistNode).y), circleRRange.max));

        $node.attr('transform', d => {
          const x = Math.max(Math.min(width - circleRRange.max, d.x), circleRRange.max);
          const y = Math.max(Math.min(width - circleRRange.max, d.y), circleRRange.max);
          return `translate(${x}, ${y})`;
        });
      });

    (simulation.force('link') as any).links(dataSet.links);

    this.simulation = simulation;
  }

}
