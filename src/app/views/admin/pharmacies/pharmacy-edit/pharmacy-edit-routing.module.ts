import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmacyEditComponent } from './pharmacy-edit.component';

const routes: Routes = [
  { path: '', component: PharmacyEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyEditRoutingModule { }
