import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationComponent } from './consultation.component';
import { AuthGuard } from '../../../guards/auth.guard';
import { ConsultationViewComponent } from './consultation-view/consultation-view.component';

const routes: Routes = [
  {
    path: '', component: ConsultationComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadChildren:()=>import('./consultation-list/consultation-list.module').then(CL=>CL.ConsultationListModule) },
      { path: 'view/:id', component: ConsultationViewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationRoutingModule { }
