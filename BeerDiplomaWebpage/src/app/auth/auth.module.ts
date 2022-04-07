import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'; 
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AuthRoutingModule,

  ],
  
  bootstrap: [AuthComponent]
})
export class AuthModule { }
