import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  public logged: Boolean = false;
  constructor(
    private router: Router,
    private cookieService:CookieService
    ) { }

  ngOnInit(): void {
    if(this.cookieService.check('user')) {
      this.logged = true;

    }
  }

  logOut() {
    this.logged = false;
    this.cookieService.delete('user');
    this.router.navigateByUrl('/');
    window.location.reload();
  }

}
