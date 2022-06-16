import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {HomeService} from "./home.service";
import {Statistics} from "./statistics";
import {Beer} from "../beer-list/beer";
import {DeviceDetectorService} from "ngx-device-detector";

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
  user:string = '';
  statistics: Statistics = {
    numberOfReviews: 0,
    numberOfPhotos: 0,
    lastThreeReviews: new Array<Beer>(),
  };
  isDesktop: boolean = true;

  constructor(
    private service: HomeService,
    private cookieService:CookieService,
    private deviceService:DeviceDetectorService,
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
      this.user = this.cookieService.get('user');
      this.message = "Witaj " + this.cookieService.get('user');
    }

    this.service.getStatistics(this.user).subscribe(data => {
      this.statistics = data.body.content;
      for (let _i = 0; _i < this.statistics.lastThreeReviews.length; _i++){
        this.getImageFromUrl(this.statistics.lastThreeReviews[_i].mainPhotoUrl, _i);
      }
    });
  }

  createImageFromBlob(image: Blob, index: number){
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.statistics.lastThreeReviews[index].image = reader.result;
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
}
