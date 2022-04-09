import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'; 
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [ AuthComponent ],
  imports: [
    BrowserModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  bootstrap: [ AuthComponent ]
})
export class AuthModule { }
