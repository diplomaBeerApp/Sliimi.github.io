import {Beer} from "../beer-list/beer";

export interface Statistics {
  numberOfReviews: number;
  numberOfPhotos: number;
  lastThreeReviews: Array<Beer>;
}
