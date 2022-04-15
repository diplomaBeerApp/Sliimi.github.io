import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public register: Boolean = false;
  public login: Boolean = false;
  public message: String = '';
  public currentRate = 8;
 
  constructor(
    private cookieService:CookieService
    ) {}

  ngOnInit(): void {
    console.log(sessionStorage.getItem('userRegister'));

    if(sessionStorage.getItem('userRegister')){
      this.register = true;
      this.message = String(sessionStorage.getItem('userRegister'));
      sessionStorage.removeItem('userRegister')
    }

    if(this.cookieService.check('reloadOnce')) {
      console.log("cos dziala");
      this.cookieService.delete('reloadOnce');
      window.location.reload()
    }

    if(this.cookieService.check('user'))
    {
      this.login = true;
      this.message = "Witaj " + this.cookieService.get('user');
    }
  }
}
