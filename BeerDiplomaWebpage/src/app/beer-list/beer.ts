export interface Beer {
  beerId: number;
  name: String;
  brewery: String;
  style: String;
}

export interface BeerFullInfo {
  beerId: number;
  name: String;
  brewery: String;
  style: String;
  abv: String;
  ibu: String;
  img: String;
}

export interface BeerReview {
  login: String;
  stars: number;
  beer_id: String;
}
