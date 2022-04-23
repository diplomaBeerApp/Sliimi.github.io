import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BeerListService} from "../beer-list.service";
import {BeerFullInfo} from "../beer";

@Component({
  selector: 'app-beer-details',
  templateUrl: './beer-details.component.html',
  styleUrls: ['./beer-details.component.css']
})
export class BeerDetailsComponent implements OnInit {
  title: String = 'Detale Piwa';
  id: number = 0;
  beer: BeerFullInfo = {
    beerId: 0,
    name: "",
    brewery: "",
    style: "",
    abv: "",
    ibu: "",
    img: "",
  };
  rating: number = 0;

  constructor(
    private service: BeerListService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService:CookieService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(data => {
      this.id = +data[data.length - 1].path;
    });
    this.service.getBeer(this.id).subscribe(data => {
      this.beer = data.body.content;
      this.beer.ibu = (this.beer.ibu == "N/A") ? 'Brak Danych' : this.beer.ibu;
      this.beer.abv = (this.beer.abv == "N/A") ? 'Brak Danych' : this.beer.abv;
      console.log(this.beer);
    });
  }

}
