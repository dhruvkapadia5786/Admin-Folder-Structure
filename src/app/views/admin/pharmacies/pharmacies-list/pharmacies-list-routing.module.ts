import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmaciesListComponent } from './pharmacies-list.component';

const routes: Routes = [
  { path: '', component: PharmaciesListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmaciesListRoutingModule { }
