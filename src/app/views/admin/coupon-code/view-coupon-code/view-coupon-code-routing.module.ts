import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCouponCodeComponent } from './view-coupon-code.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path : '', component : ViewCouponCodeComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCouponCodeRoutingModule { }
