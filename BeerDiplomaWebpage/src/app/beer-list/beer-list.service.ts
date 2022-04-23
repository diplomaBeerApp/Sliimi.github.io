import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BeerListService {
  public static url = "https://k4qauqp2v9.execute-api.us-east-1.amazonaws.com/prod/beers";

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
    return this.http.get<any>(BeerListService.url, {
      observe: 'response',
    } );
  }

  public getBeer(id :number): Observable<HttpResponse<any>> {
    return this.http.get<any>(BeerListService.url+'/'+id, {
      observe: 'response',
    } );
  }

}
