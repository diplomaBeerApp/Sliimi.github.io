import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BeerListService} from "../beer-list.service";

@Component({
  selector: 'app-beer-photo',
  templateUrl: './beer-photo.component.html',
  styleUrls: ['./beer-photo.component.css']
})

export class BeerPhotoComponent implements OnInit {
  title: String = 'Aparat';

  constructor(
    private service: BeerListService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService:CookieService
  ) {}

  ngOnInit(): void {

  }

}
