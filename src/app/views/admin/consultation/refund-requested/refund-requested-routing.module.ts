import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guards/auth.guard';
import { RefundRequestedComponent } from './refund-requested.component';

const routes: Routes = [
  {
    path: '', component: RefundRequestedComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRequestedRoutingModule { }