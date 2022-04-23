import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { BeerListComponent } from './beer-list.component';
import {BeerDetailsComponent} from "./beer-details/beer-details.component";

const routes: Routes = [
  {
    path: 'beer-list',
    component: BeerListComponent
  },
  {
    path: 'beer-list/:id',
    component: BeerDetailsComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeerListRoutingModule { }
