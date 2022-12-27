import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { SellerViewComponent } from './seller-view.component';

const routes: Routes = [
  {
    path: '', component: SellerViewComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./seller-info/seller-info.module').then(ID=>ID.SellerInfoModule) },
      { path: 'subscription-payment-history', loadChildren:()=>import('./subscription-payment-history/subscription-payment-history.module').then(VD=>VD.SubscriptionPaymentHistoryModule)},
      { path: 'products', loadChildren:()=>import('../../products/products-list/products-list.module').then(VD=>VD.ProductsListModule) },
      { path: 'orders', loadChildren:()=>import('../../orders/orders-list/orders-list.module').then(VD=>VD.OrdersListModule) },
      { path:'order-history',loadChildren:()=>import('../../orders/orders-list/orders-list.module').then(VD=>VD.OrdersListModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerViewRoutingModule { }