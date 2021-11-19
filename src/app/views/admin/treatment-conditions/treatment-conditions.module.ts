import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreatmentConditionsRoutingModule } from './treatment-conditions-routing.module';
import { TreatmentConditionsComponent } from './treatment-conditions.component';


@NgModule({
  declarations: [
    TreatmentConditionsComponent
  ],
  imports: [
    CommonModule,
    TreatmentConditionsRoutingModule
  ]
})
export class TreatmentConditionsModule { }
