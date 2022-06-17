export interface Beer {
  beerId: number;
  name: string;
  brewery: string;
  style: string;
  abv: string;
  ibu: string;
  mainPhotoUrl: string;
  image: any;
  review: number;
  tags: Array<any>;
  isImageLoaded: boolean;
}

export interface BeerFullInfo {
  beerId: number;
  name: string;
  brewery: string;
  style: string;
  abv: string;
  ibu: string;
  img: string;
  review: number;
}

export interface BeerReview {
  login: string;
  stars: number;
  beer_id: string;
}

export interface TagsReview {
  login: string;
  tags: Array<any>;
  beer_id: string;
}
