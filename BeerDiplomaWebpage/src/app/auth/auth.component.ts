import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { __values } from 'tslib';
import { AbstractEmitterVisitor } from '@angular/compiler/src/output/abstract_emitter';
import { AuthenticationService } from './authentication.service';
import { Piwo } from './user';

export interface User {
  name: String;
  style: String;
  brewery: String;
  abv: String;
  ibu: String;
  img: String;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  value: String ='begin';
  users = new Array<Piwo>();
  test: any;

  authForm = new FormGroup({
    login: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    password2: new FormControl(''),
    email: new FormControl(''),
  });

  constructor(
    private authentication: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
    ) {
    }

  ngOnInit(): void {
      this.authentication.getPiwo().subscribe(response =>{
        this.test = response;
        console.log(response);
      });

      this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
      this.title = (this.authType == 'login') ? 'Logowanie' : 'Rejestracja';
      if(this.authType == 'register'){
        this.authForm.controls["email"].addValidators(Validators.required);
        this.authForm.controls["password2"].addValidators(Validators.required);
      }
    });

  }


  onSubmit() : void {
    if(this.authType == 'login'){

    
    }  
    else{

    }

  }

}
