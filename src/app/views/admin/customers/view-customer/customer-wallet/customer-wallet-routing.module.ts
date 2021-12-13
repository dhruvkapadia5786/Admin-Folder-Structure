import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../../guards/auth.guard';
import { CustomerWalletComponent } from './customer-wallet.component';

const routes: Routes = [
  {
    path: '', component: CustomerWalletComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerWalletRoutingModule { }
