import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BeerListModule } from './beer-list/beer-list.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ReviewComponent } from './review/review.component';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import {NgbPaginationModule, NgbAlertModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NetworkInterceptor} from "./network.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ReviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    BeerListModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgbModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true,},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
