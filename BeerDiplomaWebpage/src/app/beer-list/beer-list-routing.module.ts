import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { BeerListComponent } from './beer-list.component';
import {BeerDetailsComponent} from "./beer-details/beer-details.component";
import {BeerPhotoComponent} from "./beer-photo/beer-photo.component";
import {HomeComponent} from "../home/home.component";

const routes: Routes = [
  {
    path: 'beer-list',
    component: BeerListComponent
  },

  /*
  {
    path: 'beer-list/:id',
    component: BeerDetailsComponent
  },
  /*
  {
    path: 'beer-list/:id/camera',
    component: BeerPhotoComponent
  }
  */
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeerListRoutingModule { }
