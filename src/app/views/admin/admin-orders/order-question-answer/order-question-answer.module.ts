import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderQuestionAnswerRoutingModule } from './order-question-answer-routing.module';
import { OrderQuestionAnswerComponent } from './order-question-answer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BlockUIModule } from 'ng-block-ui';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConsentModalComponent } from 'src/app/components/consent-modal/consent-modal.component';
import {ConsentModalService} from 'src/app/components/consent-modal/consent-modal.service';
import {ConsentModalModule} from 'src/app/components/consent-modal/consent-modal.module'


@NgModule({
  declarations: [OrderQuestionAnswerComponent],
  exports: [OrderQuestionAnswerComponent],
  imports: [
    CommonModule,
    OrderQuestionAnswerRoutingModule,
    MatTabsModule,
    NgxMaskModule,
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    ConsentModalModule,
    ImagePreviewModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
   providers: [Helper,ConsentModalService],
   entryComponents:[ConsentModalComponent]
})
export class OrderQuestionAnswerModule { }
