import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoTreatmentConditionComponent } from './info-treatment-condition.component';

const routes: Routes = [
   {
    path: '', component : InfoTreatmentConditionComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoTreatmentConditionRoutingModule { }
