import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ViewCustomerComponent } from './view-customer.component';

const routes: Routes = [
  {
    path: '', component: ViewCustomerComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./customer-info/customer-info.module').then(IC=>IC.CustomerInfoModule) },
      { path: 'orders',loadChildren:()=>import('./drug-orders/drug-orders.module').then(orders=>orders.DrugOrdersModule)},
      { path: 'login-history', loadChildren:()=>import('./login-history-devices/login-history-devices.module').then(loginHistory=>loginHistory.LoginHistoryDevicesModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCustomerRoutingModule { }
