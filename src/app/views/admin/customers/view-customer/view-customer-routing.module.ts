import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guards/auth.guard';
import { ViewCustomerComponent } from './view-customer.component';

const routes: Routes = [
  {
    path: '', component: ViewCustomerComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./customer-info/customer-info.module').then(IC=>IC.CustomerInfoModule) },
      { path: 'orders', loadChildren:()=>import('./orders/orders.module').then(order=>order.OrdersModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCustomerRoutingModule { }
