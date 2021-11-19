import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorViewComponent } from './doctor-view.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : DoctorViewComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorViewRoutingModule { }
