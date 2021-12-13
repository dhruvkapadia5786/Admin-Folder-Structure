import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCouponCodeComponent } from './list-coupon-code.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path:'', component : ListCouponCodeComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListCouponCodeRoutingModule { }
