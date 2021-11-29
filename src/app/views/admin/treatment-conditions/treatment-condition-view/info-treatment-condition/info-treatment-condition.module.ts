import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoTreatmentConditionComponent } from './info-treatment-condition.component';
import { InfoTreatmentConditionRoutingModule } from './info-treatment-condition-routing.module';

@NgModule({
  declarations: [
    InfoTreatmentConditionComponent
  ],
  imports: [
    CommonModule,
    InfoTreatmentConditionRoutingModule
  ]
})
export class InfoTreatmentConditionModule { }
