import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationsComponent } from './consultations.component';
import { AuthGuard } from '../../../../../guards/auth.guard';

const routes: Routes = [
  {
    path :'', component : ConsultationsComponent,canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationsRoutingModule { }
