export interface ExternalId {
  [key: string]: string;
  isrc: string;
  ean: string;
  upc: string;
}

export interface ExternalUrl {
  [name: string]: string;
  spotify: string;
}
