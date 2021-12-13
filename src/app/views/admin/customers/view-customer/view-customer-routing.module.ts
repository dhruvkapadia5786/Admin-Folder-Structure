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
      { path: 'orders', loadChildren:()=>import('./orders/orders.module').then(order=>order.OrdersModule) },
      { path: 'consultations', loadChildren:()=>import('./consultations/consultations.module').then(consultation=>consultation.ConsultationsModule) },
      { path: 'drug-orders',loadChildren:()=>import('./drug-orders/drug-orders.module').then(pharmacy=>pharmacy.DrugOrdersModule)},
      { path: 'customer-wallet', loadChildren:()=>import('./customer-wallet/customer-wallet.module').then(wallet=>wallet.CustomerWalletModule) },
      { path: 'ssf-history', loadChildren:()=>import('./ssf-history/ssf-history.module').then(ssf=>ssf.SsfHistoryModule) },
      { path: 'login-history', loadChildren:()=>import('./login-history-devices/login-history-devices.module').then(loginHistory=>loginHistory.LoginHistoryDevicesModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCustomerRoutingModule { }
