import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoHealthConditionRoutingModule } from './info-health-condition-routing.module';
import { InfoHealthConditionComponent } from './info-health-condition.component';
import { ConsultationHealthConditionsService } from '../../consultation-health-conditions.service';

@NgModule({
  declarations: [InfoHealthConditionComponent],
  imports: [
    CommonModule,
    InfoHealthConditionRoutingModule
  ],
  providers:[ConsultationHealthConditionsService]
})
export class InfoHealthConditionModule { }
