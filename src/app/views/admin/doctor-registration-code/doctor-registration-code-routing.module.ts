import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../guards/auth.guard';
import {DoctorRegistrationCodeComponent } from './doctor-registration-code.component';

const routes: Routes = [
  {
    path: '', component: DoctorRegistrationCodeComponent, canActivate: [AuthGuard],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRegistrationCodeRoutingModule { }
