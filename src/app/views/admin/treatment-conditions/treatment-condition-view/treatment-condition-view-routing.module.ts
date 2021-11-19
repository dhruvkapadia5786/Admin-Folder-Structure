import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreatmentConditionViewComponent } from './treatment-condition-view.component';

const routes: Routes = [
  { path: '', component: TreatmentConditionViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreatmentConditionViewRoutingModule { }
