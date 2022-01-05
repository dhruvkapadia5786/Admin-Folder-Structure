import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminOrdersComponent } from './admin-orders.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: AdminOrdersComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'refund/incomplete', loadChildren:()=> import('./refund-incomplete-orders/refund-incomplete-orders.module').then(RC => RC.RefundIncompleteOrdersModule) },
      { path: 'refund_processed', loadChildren:()=> import('./refund-processed-orders/refund-processed-orders.module').then(RP => RP.RefundProcessedOrdersModule) },
      { path: 'refund_requested', loadChildren:()=> import('./refunded-orders/refunded-orders.module').then(RO => RO.RefundedOrdersModule) },
      { path: 'list', loadChildren:()=> import('./orders-list/orders-list.module').then(OL => OL.OrdersListModule) },
      { path: 'view/:id', loadChildren:()=> import('./orders-view/orders-view.module').then(OV => OV.OrdersViewModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminOrdersRoutingModule { }
