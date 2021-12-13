import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCouponCodeComponent } from './create-coupon-code.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path : '', component : CreateCouponCodeComponent, canActivate :  [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCouponCodeRoutingModule { }
