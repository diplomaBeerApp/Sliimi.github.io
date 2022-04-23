import { Component, OnInit } from '@angular/core';
import {Beer} from "./beer";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BeerListService} from "./beer-list.service";

@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css']
})
export class BeerListComponent implements OnInit {
  title: String = 'Lista Piw';
  beers= new Array<Beer>();

  constructor(
    private service: BeerListService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService:CookieService
  ) {}

  ngOnInit(): void {
    this.service.getBeers().subscribe(data => {
      this.beers = data.body.content;
    });
  }

}
