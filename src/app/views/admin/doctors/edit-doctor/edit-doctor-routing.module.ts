import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditDoctorComponent } from './edit-doctor.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : EditDoctorComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditDoctorRoutingModule { }
