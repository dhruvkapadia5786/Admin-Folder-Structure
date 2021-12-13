import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guards/auth.guard';
import { RefundProcessedComponent } from './refund-processed.component';

const routes: Routes = [
  {
    path: '', component: RefundProcessedComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundProcessedRoutingModule { }