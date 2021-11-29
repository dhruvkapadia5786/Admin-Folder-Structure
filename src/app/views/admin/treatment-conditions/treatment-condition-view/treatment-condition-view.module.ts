import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreatmentConditionViewRoutingModule } from './treatment-condition-view-routing.module';
import { TreatmentConditionViewComponent } from './treatment-condition-view.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TreatmentConditionViewComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule, ReactiveFormsModule,
    TreatmentConditionViewRoutingModule
  ]
})
export class TreatmentConditionViewModule { }
