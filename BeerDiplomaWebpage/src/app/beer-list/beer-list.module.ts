import { ModuleWithProviders, NgModule } from '@angular/core';
import { BeerListRoutingModule } from './beer-list-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { BeerListComponent } from "./beer-list.component";
import { CommonModule } from '@angular/common';
import { BeerDetailsComponent} from "./beer-details/beer-details.component";
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [ BeerListComponent, BeerDetailsComponent ],
  imports: [
    BeerListRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [ CookieService ],
  bootstrap: [ BeerListComponent ]
})
export class BeerListModule { }
