import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmacyUserViewComponent } from './pharmacy-user-view.component';

const routes: Routes = [
  { path: '', component:PharmacyUserViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyUserViewRoutingModule { }
