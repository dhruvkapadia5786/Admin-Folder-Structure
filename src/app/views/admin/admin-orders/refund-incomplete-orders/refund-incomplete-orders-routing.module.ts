import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guards/auth.guard';
import { RefundIncompleteOrdersComponent } from './refund-incomplete-orders.component';

const routes: Routes = [
  {
    path: '', component: RefundIncompleteOrdersComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundIncompleteOrdersRoutingModule { }
