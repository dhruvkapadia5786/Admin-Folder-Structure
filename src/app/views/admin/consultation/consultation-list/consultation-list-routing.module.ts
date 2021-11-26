import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationListComponent } from './consultation-list.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: ConsultationListComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationListRoutingModule { }
