import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreatmentConditionViewRoutingModule } from './treatment-condition-view-routing.module';
import { TreatmentConditionViewComponent } from './treatment-condition-view.component';


@NgModule({
  declarations: [
    TreatmentConditionViewComponent
  ],
  imports: [
    CommonModule,
    TreatmentConditionViewRoutingModule
  ]
})
export class TreatmentConditionViewModule { }
