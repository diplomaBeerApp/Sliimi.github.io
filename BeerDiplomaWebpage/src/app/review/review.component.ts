import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'review',
  templateUrl: './review.component.html'
})
export class ReviewComponent implements OnInit {
  public rating: number = 0;

  authForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    password2: new FormControl(''),
    email: new FormControl(''),
  });


  constructor() { }

  ngOnInit(): void {
  }

  AddPhoto():void {

    
  }

}
