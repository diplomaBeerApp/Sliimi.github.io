import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public static urlStats = "https://k4qauqp2v9.execute-api.us-east-1.amazonaws.com/prod/users/";

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

  public getStatistics(login: string): Observable<HttpResponse<any>>{
    return this.http.get<any>(HomeService.urlStats + login + '/statistics', {
      observe: 'response',
    });
  }

  public getImage(url: any): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
