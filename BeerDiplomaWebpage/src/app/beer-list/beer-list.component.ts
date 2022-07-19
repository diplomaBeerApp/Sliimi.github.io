import { Component, OnInit } from '@angular/core';
import {Beer, BeerFullInfo, BeerReview, TagsReview} from "./beer";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BeerListService} from "./beer-list.service";
import {debounce} from "lodash";
import {DeviceDetectorService} from "ngx-device-detector";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {newArray} from "@angular/compiler/src/util";


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
  beerDetailsViewOpen:boolean = false;
  reviewConfirmation: boolean = false;
  tagsConfirmation: boolean = false;
  imageConfirmation: boolean = false;
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
    isImageLoaded: false,
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
    this.hideImageConfirmation = debounce(this.hideImageConfirmation, 3000)
    this.hideTagsConfirmation = debounce(this.hideTagsConfirmation, 3000)
    this.hideReviewConfirmation = debounce(this.hideReviewConfirmation, 3000)
  }

  ngOnInit(): void {
    this.userId = this.cookieService.get("user");
    this.isDesktop = this.deviceService.isDesktop();
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize), this.pageSize, this.userId).subscribe(data => {
      this.beers = data.body.content;
      console.log(data);
      for (let _i = 0; _i < this.pageSize; _i++){
        this.beers[_i].isImageLoaded = false;
        this.getImageFromUrl(this.beers[_i].mainPhotoUrl, _i);
      }
      this.selectedBeer = this.beers[0];
      this.mapTags(this.selectedBeer.tags);
      if (this.selectedBeer.review != null) {
        this.wasReviewedBefore = true;
        this.reviewForm.controls["stars"].setValue(this.selectedBeer.review);
      }
      this.beerListProcessing = false;
    });
  }

  onSearchChange(event: any){
    this.pageNumber = 0;
    this.service.getBeersWithQuery(event.target.value.toString(), (this.pageNumber*this.pageSize), this.pageSize, this.userId).subscribe(data => {
      this.beers = data.body.content;
      for (let _i = 0; _i < this.pageSize; _i++){
        this.beers[_i].isImageLoaded = false;
        this.getImageFromUrl(this.beers[_i].mainPhotoUrl, _i);
      }
      this.selectedBeer = this.beers[0];
    });
    this.currentQuery = event.target.value.toString();
  }

  onBeerChange(newId: number){
    var temp = this.beers.filter(el => el.beerId == newId);
    this.selectedBeer = temp[0];
    this.tagsChanged = false;
    this.mapTags(this.selectedBeer.tags);
    if (this.selectedBeer.review != null) {
      this.wasReviewedBefore = true;
      this.reviewForm.controls["stars"].setValue(this.selectedBeer.review);
    }
    else {
      this.wasReviewedBefore = false;
      this.reviewForm.controls["stars"].setValue(0);
    }
    this.reviewConfirmation = false;
    this.imageConfirmation = false;
    this.tagsConfirmation = false;
  }

  onBeerChangeMobile(newId: number){
    this.beerDetailsViewOpen = true;
    this.tagsChanged = false;
    var temp = this.beers.filter(el => el.beerId == newId);
    this.selectedBeer = temp[0];
    this.mapTags(this.selectedBeer.tags);
    if (this.selectedBeer.review != null) {
      this.wasReviewedBefore = true;
      this.reviewForm.controls["stars"].setValue(this.selectedBeer.review);
    }
    else {
      this.wasReviewedBefore = false;
      this.reviewForm.controls["stars"].setValue(0);
    }
    this.reviewConfirmation = false;
    this.imageConfirmation = false;
    this.tagsConfirmation = false;
  }

  HideBeerViewMobile(){
    this.beerDetailsViewOpen = false;
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
          this.reviewConfirmation = true;
          this.hideReviewConfirmation()
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
          this.reviewConfirmation = true;
          this.hideReviewConfirmation()
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
        this.imageConfirmation = true;
        this.hideImageConfirmation()
        this.service.incrementPhotoCount(this.userId).subscribe(response => {
          console.log(response)
        });
        console.log(response)
      });
    });
  }

  LoadMore(){
    this.beerListProcessing = true;
    this.pageNumber += 1;
    this.service.getBeersWithQuery(this.currentQuery, (this.pageNumber*this.pageSize), this.pageSize, this.userId).subscribe(data => {
      var tempLoad = <Array<Beer>>data.body.content;
      for (let beer of tempLoad) {
        this.beers.push(beer);
      }
      for (let _i = this.pageSize*this.pageNumber; _i < this.pageSize*(this.pageNumber+1); _i++){
        this.beers[_i].isImageLoaded = false;
        this.getImageFromUrl(this.beers[_i].mainPhotoUrl, _i);
      }
      this.beerListProcessing = false;
    });
  }

  createImageFromBlob(image: Blob, index: number){
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.beers[index].image = reader.result;
      this.beers[index].isImageLoaded = true;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromUrl(url: string, index: number){
    this.service.getImage(url).subscribe(data => {
      let newBlob = new Blob([data], {type: "image/jpeg"})
      this.createImageFromBlob(newBlob, index);
    }, error => {
      console.log(error);
    });
  }

  tagsForm = new FormGroup({
    tags: new FormControl(''),
  });
  tagsProcessing: boolean = false;
  tagsChanged: boolean = false;
  tagsToSend: TagsReview = {
    login: '',
    tags: new Array<any>(),
    beer_id: '',
  }

  tagsList = [
    { item_id: 1, item_text: 'Pszeniczne' },
    { item_id: 2, item_text: 'Gorzkie' },
    { item_id: 3, item_text: 'Jasne' },
    { item_id: 4, item_text: 'Ciemne' },
    { item_id: 5, item_text: 'Chmielowe' },
    { item_id: 6, item_text: 'Cytrusowe' },
    { item_id: 7, item_text: 'Słodowe' },
    { item_id: 8, item_text: 'Owocowe' },
    { item_id: 9, item_text: 'Kwaśne' },
    { item_id: 10, item_text: 'Karmelowe' },
    { item_id: 11, item_text: 'Słodkie' },
    { item_id: 12, item_text: 'Czekoladowe' },
    { item_id: 13, item_text: 'Kawowe' },
    { item_id: 14, item_text: 'Mleczne' },
    { item_id: 15, item_text: 'Ziołowe' },
    { item_id: 16, item_text: 'Bananowe' },
    { item_id: 17, item_text: 'Miodowe' },
    { item_id: 17, item_text: 'Kwiatowe' }
  ];
  selectedTags = new Array<any>();
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    itemsShowLimit: 5,
    allowSearchFilter: true,
    searchPlaceholderText: 'Szukaj',
    selectAllText: 'Zaznacz Wszystkie',
    unSelectAllText: 'Odznacz Wszystkie',
    enableCheckAll: false,
    limitSelection: 5
  };

  mapTagFromBackend(tag: string): string{
    switch (tag) {
      case 'WHEAT':
        return 'Pszeniczne';
      case 'BITTER':
        return 'Gorzkie';
      case 'LIGHT':
        return'Jasne';
      case 'DARK':
        return 'Ciemne';
      case 'HOPPY':
        return 'Chmielowe';
      case 'CITRUS':
        return 'Cytrusowe';
      case 'MALT':
        return 'Słodowe';
      case 'FRUITY':
        return 'Owocowe';
      case 'SOUR':
        return 'Kwaśne';
      case 'CARMEL':
        return 'Karmelowe';
      case 'SWEET':
        return 'Słodkie';
      case 'CHOCOLATE':
        return 'Czekoladowe';
      case 'COFFEE':
        return 'Kawowe';
      case 'MILK':
        return 'Mleczne';
      case 'HERBAL':
        return 'Ziołowe';
      case 'BANANA':
        return 'Bananowe';
      case 'HONEY':
        return 'Miodowe';
      case 'FLOWER':
        return 'Kwiatowe';
      default:
        console.log("problem z mapowaniem tagów");
        return '';
    }
  }

  unmapTagForBackend(tag: string): string{
    switch (tag) {
      case 'Pszeniczne':
        return 'WHEAT';
      case 'Gorzkie':
        return 'BITTER';
      case 'Jasne':
        return'LIGHT';
      case 'Ciemne':
        return 'DARK';
      case 'Chmielowe':
        return 'HOPPY';
      case 'Cytrusowe':
        return 'CITRUS';
      case 'Słodowe':
        return 'MALT';
      case 'Owocowe':
        return 'FRUITY';
      case 'Kwaśne':
        return 'SOUR';
      case 'Karmelowe':
        return 'CARMEL';
      case 'Słodkie':
        return 'SWEET';
      case 'Czekoladowe':
        return 'CHOCOLATE';
      case 'Kawowe':
        return 'COFFEE';
      case 'Mleczne':
        return 'MILK';
      case 'Ziołowe':
        return 'HERBAL';
      case 'Bananowe':
        return 'BANANA';
      case 'Miodowe':
        return 'HONEY';
      case 'Kwiatowe':
        return 'FLOWER';
      default:
        console.log("problem z mapowaniem tagów");
        return '';
    }
  }

  mapTags(tags: Array<string>){
    var retMap: Array<{ item_id: number, item_text: string }> = new Array<{ item_id: number, item_text: string }>();
    for (let tag of tags){
      var temp = this.tagsList.filter(el => el.item_text == this.mapTagFromBackend(tag));
      retMap.push(this.tagsList[this.tagsList.indexOf(temp[0])]);
    }
    this.tagsForm.controls["tags"].setValue(retMap);
  }

  unmapTags(tagsToProcess: Array<{ item_id: number, item_text: string }>): Array<string>{
    var tempUnmap = new Array<string>();
    for (let tag of tagsToProcess){
      tempUnmap.push(this.unmapTagForBackend(tag.item_text));
    }
    return tempUnmap;
  }

  onTagSelect(event: any){
    this.tagsChanged = true;
  }

  onSubmitTags() : void {
    this.tagsProcessing = true;
    this.tagsToSend.login = this.userId;
    this.tagsToSend.beer_id = this.selectedBeer.beerId.toString();
    this.tagsToSend.tags = this.unmapTags(this.tagsForm.controls["tags"].value);
    console.log(this.tagsToSend);
    this.service.putBeerTags(this.tagsToSend).subscribe(data => {
      this.tagsProcessing = false;
      var temp = this.beers.filter(el => el.beerId == this.selectedBeer.beerId);
      this.beers[this.beers.indexOf(temp[0])].tags = this.tagsToSend.tags;
      this.tagsConfirmation = true;
      this.tagsChanged = false;
      this.hideTagsConfirmation()
    });
  }

  hideReviewConfirmation(): void{
    this.reviewConfirmation = false;
  }

  hideTagsConfirmation(): void{
    this.tagsConfirmation = false;
  }

  hideImageConfirmation(): void{
    this.imageConfirmation = false;
  }
}
