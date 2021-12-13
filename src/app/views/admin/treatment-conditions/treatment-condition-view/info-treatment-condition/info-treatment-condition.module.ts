import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoTreatmentConditionComponent } from './info-treatment-condition.component';
import { InfoTreatmentConditionRoutingModule } from './info-treatment-condition-routing.module';
import { ChangeSequenceModule } from 'src/app/shared/change-sequence/change-sequence.module';
import {ImagePreviewModule} from 'src/app/shared/image-preview/image-preview.module';

@NgModule({
  declarations: [
    InfoTreatmentConditionComponent
  ],
  imports: [
    CommonModule,
    InfoTreatmentConditionRoutingModule,
    ChangeSequenceModule,
    ImagePreviewModule
  ]
})
export class InfoTreatmentConditionModule { }
