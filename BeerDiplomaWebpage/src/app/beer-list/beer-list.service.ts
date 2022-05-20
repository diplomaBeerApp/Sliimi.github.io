import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError,throwError } from 'rxjs';
import {BeerReview, TagsReview} from "./beer";
import {Byte} from "@angular/compiler/src/util";
import {SafeHtml} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})

export class BeerListService {
  public static urlBeers = "https://k4qauqp2v9.execute-api.us-east-1.amazonaws.com/prod/beers";
  public static urlReviews = "https://k4qauqp2v9.execute-api.us-east-1.amazonaws.com/prod/reviews";

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }

    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  constructor(private http: HttpClient) { }

  public getBeers(): Observable<HttpResponse<any>>{
    return this.http.get<any>(BeerListService.urlBeers, {
      observe: 'response',
    } );
  }

  public getBeersWithQuery(query: string, start: number, limit: number, login: string): Observable<HttpResponse<any>>{
    return this.http.get<any>(BeerListService.urlBeers + '?queryPhrase=' + query + '&limit=' + limit + '&start=' + start + '&login=' + login, {
      observe: 'response',
    } );
  }

  public getBeer(id :number, user: String): Observable<HttpResponse<any>> {
    return this.http.get<any>(BeerListService.urlBeers+'/'+id+ '?login=' + user, {
      observe: 'response',
    } );
  }

  public addReview(review: BeerReview): Observable<HttpResponse<BeerReview>> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<BeerReview>(BeerListService.urlReviews, review, {
      headers: headers,
      observe: 'response',
    });
  }

  public updateReview(review: BeerReview): Observable<HttpResponse<number>> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<number>(BeerListService.urlReviews + '/' + review.login + '/' + review.beer_id, review.stars, {
      headers: headers,
      observe: 'response',
    });
  }

  public getPhotoUrl(id :number): Observable<HttpResponse<any>> {
    return this.http.get<any>(BeerListService.urlBeers+'/' + id + '/image', {
      observe: 'response',
    } );
  }

  public uploadPhoto(url: string, photoData: File): Observable<HttpResponse<any>>{
    return this.http.put(url, photoData, {
      observe: 'response',
    });
  }

  public getImage(url: any): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  public getBeerTags(): Observable<HttpResponse<any>>{
    return this.http.get(BeerListService.urlBeers + '/tags', {
      observe: 'response',
    });
  }

  public putBeerTags(tags: TagsReview): Observable<HttpResponse<any>>{
    return this.http.put(BeerListService.urlReviews + '/' + tags.login + '/' + tags.beer_id + '/tags',tags.tags , {
      observe: 'response',
    });
  }

}
