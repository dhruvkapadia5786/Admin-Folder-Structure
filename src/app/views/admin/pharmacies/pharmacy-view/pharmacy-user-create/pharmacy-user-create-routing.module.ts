import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmacyUserCreateComponent } from './pharmacy-user-create.component';

const routes: Routes = [
  {
  path:'',
  component:PharmacyUserCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyUserCreateRoutingModule { }
