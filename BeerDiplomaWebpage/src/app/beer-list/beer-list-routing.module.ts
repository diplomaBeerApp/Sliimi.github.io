import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { BeerListComponent } from './beer-list.component';

const routes: Routes = [
  {
    path: 'beer-list',
    component: BeerListComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeerListRoutingModule { }
