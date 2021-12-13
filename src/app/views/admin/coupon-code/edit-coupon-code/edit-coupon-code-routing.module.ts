import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCouponCodeComponent } from './edit-coupon-code.component';

const routes: Routes = [
  {
    path: "", component: EditCouponCodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCouponCodeRoutingModule { }
