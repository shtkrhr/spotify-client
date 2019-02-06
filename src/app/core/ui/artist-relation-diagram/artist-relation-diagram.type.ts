import * as d3 from 'd3';
import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { Artist } from '../../api/responses/artist';

export type D3Selection = d3.Selection<d3.BaseType, any, d3.BaseType, any>;

export type ArtistNode = Artist & SimulationNodeDatum;
export type ArtistLink = SimulationLinkDatum<ArtistNode>;

export interface ArtistRelationDataSet {
  artists: ArtistNode[];
  links: ArtistLink[];
}

export interface Range {
  min: number;
  max: number;
}

export interface LinkCountData extends Range {
  map: Map<string, number>;
}
