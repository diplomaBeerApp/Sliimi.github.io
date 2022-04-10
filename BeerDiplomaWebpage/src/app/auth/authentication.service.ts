import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError,throwError } from 'rxjs';
import { User, UserInfo, Piwo } from './user';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  public static url = "https://k4qauqp2v9.execute-api.us-east-1.amazonaws.com/prod/users";

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  constructor(private http: HttpClient) { }

  public checkUser(user: User): Observable<HttpResponse<User>>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      });

    return this.http.post<User>(AuthenticationService.url + '/' + user.login, user.password, { 
      headers: headers,
      observe: 'response',
    }).pipe(
      catchError((err) => {
        console.log('error caught in service')
        console.error(err);

        //Handle the error here

        return throwError(err);    //Rethrow it back to component
      }));
  }

  public addUser(userInfo: UserInfo): Observable<HttpResponse<UserInfo>> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      });

    return this.http.post<UserInfo>(AuthenticationService.url, userInfo, { 
      headers: headers,
      observe: 'response',
    });
  }

  public getPiwo(): Observable<HttpResponse<Piwo>>{
    return this.http.get<Piwo>("https://k4qauqp2v9.execute-api.us-east-1.amazonaws.com/prod/beers", { observe: 'response' });
  }


}
