import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BeerListService} from "../beer-list.service";
import {BeerFullInfo, BeerReview} from "../beer";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DeviceDetectorService } from 'ngx-device-detector';

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
    review: 0,
  };
  rating: number = 0;
  userId: string = '';
  wasReviewedBefore: boolean = false;
  isDesktop:boolean = true;

  review: BeerReview ={
    login: '',
    stars: 0,
    beer_id: '',
  }

  reviewForm = new FormGroup({
    stars: new FormControl(''),
  });

  constructor(
    private service: BeerListService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService:CookieService,
    private deviceService:DeviceDetectorService
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe(data => {
      this.id = +data[data.length - 1].path;
    });
    this.isDesktop = this.deviceService.isDesktop();
    this.userId = this.cookieService.get("user");
    this.service.getBeer(this.id, this.userId).subscribe(data => {
      this.beer = data.body.content;
      this.beer.ibu = (this.beer.ibu == "N/A") ? 'Brak Danych' : this.beer.ibu;
      this.beer.abv = (this.beer.abv == "N/A") ? 'Brak Danych' : this.beer.abv;
      if (this.beer.review != null) {
        this.wasReviewedBefore = true;
        this.reviewForm.controls["stars"].setValue(this.beer.review);
      }
      else{
        this.reviewForm.controls["stars"].setValue(1);
      }
    });

  }

  onSubmitReview() : void {
    this.review.login = this.userId;
    this.review.stars = parseInt(this.reviewForm.controls["stars"].value);
    this.review.beer_id = this.id.toString();
    if (!this.wasReviewedBefore) {
      this.service.addReview(this.review).subscribe(response => {
        console.log(response)
        this.wasReviewedBefore = true;
        if (response.status == 204) {
          //sessionStorage.setItem('userRegister','Dodanie recenzji powiodło się');
          //this.router.navigateByUrl('/');
        }

      }, err => {
        // console.log('błąd przy wysyłaniu recenzji');
      });
    }
    else{
      this.service.updateReview(this.review).subscribe(response => {
        console.log(response)
        this.wasReviewedBefore = true;
        if (response.status == 204) {
          //sessionStorage.setItem('userRegister','Dodanie recenzji powiodło się');
          //this.router.navigateByUrl('/');
        }

      }, err => {
        // console.log('błąd przy wysyłaniu recenzji');
      });
    }
  }

  fileToUpload: File = new File(new Array<BlobPart>(),'');

  photoForm = new FormGroup({
    file: new FormControl(''),
    fileSource: new FormControl(''),
  });

  onFileChange(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  onSubmitPhoto() : void {
  this.service.getPhotoUrl(this.id).subscribe(data => {
    let url = data.body.content;
    this.service.uploadPhoto(url, this.fileToUpload).subscribe(response => {
      console.log(response)
    });
  });
  }
}
