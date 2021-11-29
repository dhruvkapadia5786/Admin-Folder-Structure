import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TreatmentConditionViewComponent } from './treatment-condition-view.component';

const routes: Routes = [
  {
    path: '', component : TreatmentConditionViewComponent, canActivate : [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./info-treatment-condition/info-treatment-condition.module').then(info => info.InfoTreatmentConditionModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreatmentConditionViewRoutingModule { }
