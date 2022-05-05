import { Component, OnInit } from '@angular/core';
import {Beer} from "./beer";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BeerListService} from "./beer-list.service";
import {debounce} from "lodash";

@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css']
})
export class BeerListComponent implements OnInit {
  title: String = 'Lista Piw';
  beers= new Array<Beer>();
  pageSize: number = 20;
  pageNumber: number = 0;
  currentQuery: string = '';

  constructor(
    private service: BeerListService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService:CookieService
  ) {
    this.onSearchChange = debounce(this.onSearchChange, 1000)
  }

  ngOnInit(): void {
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize+1), this.pageSize).subscribe(data => {
      this.beers = data.body.content;
    });
  }

  onSearchChange(event: any){
    this.pageNumber = 0;
    this.service.getBeersWithQuery(event.target.value.toString(), (this.pageNumber*this.pageSize+1), this.pageSize).subscribe(data => {
      this.beers = data.body.content;
    });
    this.currentQuery = event.target.value.toString();
  }

  nextPage(){
    this.pageNumber += 1;
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize+1), this.pageSize).subscribe(data => {
      this.beers = data.body.content;
    });
  }

  previousPage(){
    this.pageNumber -= 1;
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize+1), this.pageSize).subscribe(data => {
      this.beers = data.body.content;
    });
  }
}
