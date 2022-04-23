import { ModuleWithProviders, NgModule } from '@angular/core';
import { BeerListRoutingModule } from './beer-list-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { BeerListComponent } from "./beer-list.component";

@NgModule({
  declarations: [ BeerListComponent ],
  imports: [
    BeerListRoutingModule,
  ],
  providers: [ CookieService ],
  bootstrap: [ BeerListComponent ]
})
export class BeerListModule { }
