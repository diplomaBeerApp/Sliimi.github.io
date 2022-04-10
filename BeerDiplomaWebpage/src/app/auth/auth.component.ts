import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import { AbstractEmitterVisitor } from '@angular/compiler/src/output/abstract_emitter';
import { AuthenticationService } from './authentication.service';
import { User, UserInfo, Piwo } from './user';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit,OnChanges {
  authType: String = '';
  title: String = '';
  value: String ='begin';
  errors = new Array<String>();
  status: number = 0;
  userInfo: UserInfo={
    login:'',
    email:'',
    password:'',
  };


  
  user: User={
    login:'',
    password:'',
  }

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
      this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
      this.title = (this.authType == 'login') ? 'Logowanie' : 'Rejestracja';
      if(this.authType == 'register') {
        this.authForm.controls["email"].addValidators(Validators.required);
        this.authForm.controls["password2"].addValidators(Validators.required);
      }
    });

  }

  checkEmail(): void {
    const errorStr = "Błędny email";
    if(this.authForm.controls["email"].value != "") {
      const regularExpression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!regularExpression.test(String(this.authForm.controls["email"].value).toLowerCase())){
        
        if(!this.errors.includes(errorStr)){
          this.errors.push(errorStr);
        }
      }
      else{
        if(this.errors.includes(errorStr)){
          this.errors.splice(this.errors.indexOf(errorStr),1);
        }
      }
    }
    else
    {
      if(this.errors.includes(errorStr)){
        this.errors.splice(this.errors.indexOf(errorStr),1);
      }
    }
  }

  checkPassword(): void {
    if(this.authType == 'register')
    {
      const errorStr = "Podane hasła są różne";
      const errorStr2 = "Hasło jest za krótkie lub słabe, dobre hasło potrzebuje małej i dużej litery oraz cyfry i znaku specjalnego";
      if(this.authForm.controls["password"].value != "") {
        if(this.authForm.controls["password2"].value != "") { // check if passwords are the same
          if(this.authForm.controls["password"].value != this.authForm.controls["password2"].value){
            if(!this.errors.includes(errorStr)) {
              this.errors.push(errorStr);
            }
          }
          else {
            if(this.errors.includes(errorStr)) {
              this.errors.splice(this.errors.indexOf(errorStr),1);
            }
          }
        }
        
        const regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if(!regularExpression.test(String(this.authForm.controls["password"].value))) { //check if password is "smart"
        
          if(!this.errors.includes(errorStr2)) {
            this.errors.push(errorStr2);
          }
        }
        else {
          if(this.errors.includes(errorStr2)) {
            this.errors.splice(this.errors.indexOf(errorStr2),1);
          }
        }
        
      }
      else {
        if(this.errors.includes(errorStr)) {
          this.errors.splice(this.errors.indexOf(errorStr),1);
        }

        if(this.errors.includes(errorStr2)) {
          this.errors.splice(this.errors.indexOf(errorStr2),1);
        }
      }
    }
  }

  checkLogin(): void { 
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  onSubmit() : void {
    const errorReg = "Już istnieje uzytkownik o podanym loginie";
    const successReg = "Wow! właśnie założyłeś konto";
    const errorLog = "Błędny login lub hasło";
    if(this.errors.includes(errorReg)) {
      this.errors.splice(this.errors.indexOf(errorReg),1);
    }

    if(this.errors.includes(errorLog)) {
      this.errors.splice(this.errors.indexOf(errorLog),1);
    }

    if(this.authType == 'login') {
        const salt = bcrypt.genSaltSync(10);
        this.user.login = this.authForm.controls["login"].value;   
        this.user.password = bcrypt.hashSync(this.authForm.controls["password"].value, salt);
        console.log(this.user);
        this.authentication.checkUser(this.user).subscribe( response=>{
          
          this.status = response.status;
        }, err =>{
          this.status = err.status;
          
        });
        console.log(this.status);
        if(this.status == 403)
        {
          if(!this.errors.includes(errorLog)) {
            this.errors.push(errorLog);
          }
        }

    }  
    else{
      if(this.errors.length == 0) {

        const salt = bcrypt.genSaltSync(10);
        this.userInfo.login = this.authForm.controls["login"].value;
        this.userInfo.password = bcrypt.hashSync(this.authForm.controls["password"].value, salt);
        this.userInfo.email = this.authForm.controls["email"].value;
        console.log(this.userInfo);
        this.authentication.addUser(this.userInfo).subscribe(response => {
          this.status = response.status
          console.log(response);
          console.log(this.status);
        },err => {
          this.status = err.status;
        });

        if(this.status == 204)
        {
          if(!this.errors.includes(successReg)) {
            this.errors.push(successReg);
          }
        }

        if(this.status == 400)
        {
          if(!this.errors.includes(errorReg)) {
            this.errors.push(errorReg);
          }
        }
      }
    }
  }
}
