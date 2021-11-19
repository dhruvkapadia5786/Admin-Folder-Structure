import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderQuestionAnswerRoutingModule } from './order-question-answer-routing.module';
import { OrderQuestionAnswerComponent } from './order-question-answer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { Helper } from 'src/app/services/helper.service';


@NgModule({
  declarations: [OrderQuestionAnswerComponent],
  exports: [OrderQuestionAnswerComponent],
  imports: [
    CommonModule,
    OrderQuestionAnswerRoutingModule,
    MatTabsModule,
    NgxMaskModule,
    DataTablesModule,
    ReactiveFormsModule,
    AccordionModule.forRoot()
  ],
   providers: [Helper]
})
export class OrderQuestionAnswerModule { }
