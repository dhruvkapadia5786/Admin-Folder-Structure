import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmacyUserManagementComponent } from './pharmacy-user-management.component';

const routes: Routes = [
  {
  path:'',
  component:PharmacyUserManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyUserManagementRoutingModule { }
