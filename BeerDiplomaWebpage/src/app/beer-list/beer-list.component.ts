import { Component, OnInit } from '@angular/core';
import {Beer, BeerFullInfo, BeerReview} from "./beer";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BeerListService} from "./beer-list.service";
import {debounce} from "lodash";
import {DeviceDetectorService} from "ngx-device-detector";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css']
})
export class BeerListComponent implements OnInit {
  title: string = 'Lista Piw';
  beers= new Array<Beer>();
  pageSize: number = 12;
  pageNumber: number = 0;
  currentQuery: string = '';
  isDesktop:boolean = true;
  beerListProcessing = true;

  selectedBeer: Beer = {
    beerId: 0,
    name: "",
    brewery: "",
    style: "",
    abv: "",
    ibu: "",
    mainPhotoUrl: "",
    image: "",
    tags: new Array<any>(),
    review: 0,
  };

  userId: string = '';
  rating: number = 0;
  wasReviewedBefore: boolean = false;
  review: BeerReview ={
    login: '',
    stars: 0,
    beer_id: '',
  }
  reviewProcessing: boolean = false;

  reviewForm = new FormGroup({
    stars: new FormControl('0',[Validators.required, Validators.min(1), Validators.max(10), this.differentValueValidator()]),
  });

  constructor(
    private service: BeerListService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService:CookieService,
    private deviceService:DeviceDetectorService,
    private sanitizer: DomSanitizer
  ) {
    this.onSearchChange = debounce(this.onSearchChange, 1000)
  }

  ngOnInit(): void {
    this.userId = this.cookieService.get("user");
    this.isDesktop = this.deviceService.isDesktop();
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize+1), this.pageSize, this.userId).subscribe(data => {
      this.beers = data.body.content;
      for (let _i = 0; _i < this.pageSize; _i++){
        this.getImageFromUrl(this.beers[_i].mainPhotoUrl, _i);
      }
      this.selectedBeer = this.beers[0];
      if (this.selectedBeer.review != null) {
        this.wasReviewedBefore = true;
        this.reviewForm.controls["stars"].setValue(this.selectedBeer.review);
      }
      this.beerListProcessing = false;
    });
  }

  onSearchChange(event: any){
    this.pageNumber = 0;
    this.service.getBeersWithQuery(event.target.value.toString(), (this.pageNumber*this.pageSize+1), this.pageSize, this.userId).subscribe(data => {
      this.beers = data.body.content;
    });
    this.currentQuery = event.target.value.toString();
  }

  onBeerChange(newId: number){
    var temp = this.beers.filter(el => el.beerId == newId);
    this.selectedBeer = temp[0];
    if (this.selectedBeer.review != null) {
      this.wasReviewedBefore = true;
      this.reviewForm.controls["stars"].setValue(this.selectedBeer.review);
    }
    else {
      this.wasReviewedBefore = false;
      this.reviewForm.controls["stars"].setValue(0);
    }
  }

  nextPage(){
    this.pageNumber += 1;
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize+1), this.pageSize, this.userId).subscribe(data => {
      this.beers = data.body.content;
    });
  }

  previousPage(){
    this.pageNumber -= 1;
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize+1), this.pageSize, this.userId).subscribe(data => {
      this.beers = data.body.content;
    });
  }

  differentValueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (value != this.selectedBeer.review) {
        return null;
      }
      else {
        return {"d":"upa"};
      }

    }
  }

  onSubmitReview() : void {
    this.reviewProcessing = true;
    this.review.login = this.userId;
    this.review.stars = parseInt(this.reviewForm.controls["stars"].value);
    this.review.beer_id = this.selectedBeer.beerId.toString();
    if (!this.wasReviewedBefore) {
      this.service.addReview(this.review).subscribe(response => {
        this.reviewProcessing = false;
        console.log(response)
        this.wasReviewedBefore = true;
        this.selectedBeer.review = parseInt(this.reviewForm.controls["stars"].value);
        var temp = this.beers.filter(el => el.beerId == this.selectedBeer.beerId);
        this.beers[this.beers.indexOf(temp[0])].review = parseInt(this.reviewForm.controls["stars"].value);
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
        this.reviewProcessing = false;
        console.log(response)
        this.wasReviewedBefore = true;
        this.selectedBeer.review = parseInt(this.reviewForm.controls["stars"].value);
        var temp = this.beers.filter(el => el.beerId == this.selectedBeer.beerId);
        this.beers[this.beers.indexOf(temp[0])].review = parseInt(this.reviewForm.controls["stars"].value);
        this.reviewForm.controls["stars"].setValue(this.selectedBeer.review);
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
    file: new FormControl('',Validators.required),
    fileSource: new FormControl(''),
  });
  photoProcessing: boolean = false;

  onFileChange(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  onSubmitPhoto() : void {
    this.photoProcessing = true;
    this.service.getPhotoUrl(this.selectedBeer.beerId).subscribe(data => {
      let url = data.body.content;
      this.service.uploadPhoto(url, this.fileToUpload).subscribe(response => {
        this.photoProcessing = false;
        console.log(response)
      });
    });
  }

  LoadMore(){
    this.beerListProcessing = true;
    this.pageNumber += 1;
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize+1), this.pageSize, this.userId).subscribe(data => {
      var temp = <Array<Beer>>data.body.content;
      for (let beer of temp) {
        this.beers.push(beer);
      }
      for (let _i = this.pageSize*this.pageNumber; _i < this.pageSize*(this.pageNumber+1); _i++){
        this.getImageFromUrl(this.beers[_i].mainPhotoUrl, _i);
      }
      this.beerListProcessing = false;
    });
  }

  createImageFromBlob(image: Blob, index: number){
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.beers[index].image = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromUrl(url: string, index: number){
    this.service.getImage(url).subscribe(data => {
      this.createImageFromBlob(data, index);
    }, error => {
      console.log(error);
    });
  }
}
