import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferralTransactionsComponent } from './referral-transactions.component';
import { AuthGuard } from '../../../guards/auth.guard';

const routes: Routes = [
  {
    path:'', component : ReferralTransactionsComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralTransactionsRoutingModule { }
