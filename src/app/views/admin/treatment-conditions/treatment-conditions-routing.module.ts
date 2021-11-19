import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TreatmentConditionsComponent } from './treatment-conditions.component';

const routes: Routes = [
  {
    path: '', component: TreatmentConditionsComponent, canActivate: [AuthGuard],
    children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', loadChildren:()=>import('./treatment-condition-list/treatment-condition-list.module').then(TCL=>TCL.TreatmentConditionListModule) },
        { path: 'view/:treatment_condition_id', loadChildren:()=>import('./treatment-condition-view/treatment-condition-view.module').then(TCV=>TCV.TreatmentConditionViewModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreatmentConditionsRoutingModule { }
