import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guards/auth.guard';
import { RefundedOrdersComponent } from './refunded-orders.component';

const routes: Routes = [
  {
    path: '', component: RefundedOrdersComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundedOrdersRoutingModule { }
