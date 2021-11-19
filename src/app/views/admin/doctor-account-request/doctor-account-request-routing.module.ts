import { NgModule } from '@angular/core';
import { AuthGuard } from '../../../guards/auth.guard';
import { DoctorAccountRequestComponent } from './doctor-account-request.component';
import { Routes, RouterModule } from '@angular/router';
import { AccountRequestListComponent } from './account-request-list/account-request-list.component';
import { AccountRequestViewComponent } from './account-request-view/account-request-view.component';
import { AccountRequestEditComponent } from './account-request-edit/account-request-edit.component';
import { AccountRequestRegistrationComponent } from './account-request-registration/account-request-registration.component';

const routes: Routes = [
  {
    path: '', component: DoctorAccountRequestComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: AccountRequestListComponent },
      { path: 'view/:id', component: AccountRequestViewComponent},
      { path: 'edit/:id', component: AccountRequestEditComponent},
      { path: 'registration/:id', component: AccountRequestRegistrationComponent},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorAccountRequestRoutingModule { }
