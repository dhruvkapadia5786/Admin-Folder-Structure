import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RefundProcessedOrdersComponent } from './refund-processed-orders.component';

const routes: Routes = [
  {
    path: '', component: RefundProcessedOrdersComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundProcessedOrdersRoutingModule { }
