import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorConsultationsComponent } from './doctor-consultations.component';
import { AuthGuard } from '../../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : DoctorConsultationsComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorConsultationsRoutingModule { }
