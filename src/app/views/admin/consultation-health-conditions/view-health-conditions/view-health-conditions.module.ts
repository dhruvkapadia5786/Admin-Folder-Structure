import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ViewHealthConditionsRoutingModule } from './view-health-conditions-routing.module';
import { ViewHealthConditionsComponent } from './view-health-conditions.component';

@NgModule({
  declarations: [ViewHealthConditionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    ViewHealthConditionsRoutingModule
  ]
})
export class ViewHealthConditionsModule { }
