import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError,throwError } from 'rxjs';
import { BeerReview } from "./beer";

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

  public getBeer(id :number): Observable<HttpResponse<any>> {
    return this.http.get<any>(BeerListService.urlBeers+'/'+id, {
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

}
