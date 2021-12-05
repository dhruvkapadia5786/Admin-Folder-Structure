import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletTransactionsComponent } from './wallet-transactions.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: WalletTransactionsComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletTransactionsRoutingModule { }
