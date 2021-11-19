import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreatmentConditionListComponent } from './treatment-condition-list.component';

const routes: Routes = [
  { path: '', component: TreatmentConditionListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreatmentConditionListRoutingModule { }
