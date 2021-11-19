import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoctorsComponent } from './doctors.component';
  import { AuthGuard } from '../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: DoctorsComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadChildren:()=> import('./doctor-list/doctor-list.module').then(DL=>DL.DoctorListModule) },
      { path: 'view/:id', loadChildren:()=> import('./doctor-view/doctor-view.module').then(DV=>DV.DoctorViewModule) },
      { path: 'add', loadChildren:()=> import('./create-doctor/create-doctor.module').then(DC=>DC.CreateDoctorModule) },
      { path: 'edit/:id', loadChildren:()=> import('./edit-doctor/edit-doctor.module').then(DE=>DE.EditDoctorModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }
