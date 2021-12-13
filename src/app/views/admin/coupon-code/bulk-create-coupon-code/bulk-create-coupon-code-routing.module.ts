import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkCreateCouponCodeComponent } from './bulk-create-coupon-code.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path : '', component : BulkCreateCouponCodeComponent, canActivate :  [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkCreateCouponCodeRoutingModule { }
