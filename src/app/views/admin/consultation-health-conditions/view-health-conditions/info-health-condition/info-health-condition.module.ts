import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoHealthConditionRoutingModule } from './info-health-condition-routing.module';
import { InfoHealthConditionComponent } from './info-health-condition.component';
import { ConsultationHealthConditionsService } from '../../consultation-health-conditions.service';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { ChangeSequenceModule } from 'src/app/shared/change-sequence/change-sequence.module';

@NgModule({
  declarations: [InfoHealthConditionComponent],
  imports: [
    CommonModule,
    ImagePreviewModule,
    InfoHealthConditionRoutingModule,
    ChangeSequenceModule
  ],
  providers:[ConsultationHealthConditionsService]
})
export class InfoHealthConditionModule { }
