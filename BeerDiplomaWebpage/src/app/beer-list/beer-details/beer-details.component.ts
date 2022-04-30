import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BeerListService} from "../beer-list.service";
import {BeerFullInfo, BeerReview} from "../beer";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
  rating: number = 1;
  userId: string = '';

  review: BeerReview ={
    login: '',
    stars: 1,
    beer_id: '',
  }

  reviewForm = new FormGroup({
    stars: new FormControl(''),
  });

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
    });
    this.userId = this.cookieService.get("user");
    console.log(this.userId);
  }

  onSubmit() : void {
    this.review.login = this.userId;
    this.review.stars = parseInt(this.reviewForm.controls["stars"].value);
    this.review.beer_id = this.id.toString();
    this.service.addReview(this.review).subscribe(response => {
      console.log(response)
      if(response.status == 204) {
        //sessionStorage.setItem('userRegister','Dodanie recenzji powiodło się');
        //this.router.navigateByUrl('/');
      }

    },err => {
     // console.log('błąd przy wysyłaniu recenzji');
    });
  }
}
