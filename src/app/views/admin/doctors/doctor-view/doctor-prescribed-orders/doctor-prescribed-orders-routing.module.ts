import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorPrescribedOrdersComponent } from './doctor-prescribed-orders.component';
import { AuthGuard } from '../../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : DoctorPrescribedOrdersComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorPrescribedOrdersRoutingModule { }
