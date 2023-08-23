export interface BopisSearch {
  term: string;
  bopisQuery: string; // location uses zip, so value to show is different
}

export interface StoreSearchSuggestions {
  stores?: BopisSearch[];
  locations?: BopisSearch[];
  zip?: BopisSearch[];
}
