import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmacyAddComponent } from './pharmacy-add.component';

const routes: Routes = [
  { path: '', component: PharmacyAddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyAddRoutingModule { }
