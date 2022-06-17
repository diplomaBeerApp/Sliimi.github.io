import { ModuleWithProviders, NgModule } from '@angular/core';
import { BeerListRoutingModule } from './beer-list-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { BeerListComponent } from "./beer-list.component";
import { CommonModule } from '@angular/common';
import { BeerDetailsComponent} from "./beer-details/beer-details.component";
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CameraComponent } from '../camera/camera.component';
import { WebcamModule } from 'ngx-webcam';
import {BeerPhotoComponent} from "./beer-photo/beer-photo.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatIconModule} from '@angular/material/icon'
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [ BeerListComponent, BeerDetailsComponent, CameraComponent, BeerPhotoComponent ],
  imports: [
    BeerListRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    WebcamModule,
    InfiniteScrollModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [ CookieService ],
  bootstrap: [ BeerListComponent ]
})
export class BeerListModule { }
