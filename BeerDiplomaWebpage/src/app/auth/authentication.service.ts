import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Piwo } from './user';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(private http: HttpClient) { }

  public getPiwo(): Observable<Piwo>{
    const options = {
      responseType: 'json' as const
    };
    const url = "https://k4qauqp2v9.execute-api.us-east-1.amazonaws.com/prod/beers";
    return this.http.get<Piwo>(url, options);  
  }

}
