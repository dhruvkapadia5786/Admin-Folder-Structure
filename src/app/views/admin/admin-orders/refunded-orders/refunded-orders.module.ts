import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundedOrdersComponent } from './refunded-orders.component';
import { RefundedOrdersRoutingModule } from './refunded-orders-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {orderHelper} from 'src/app/services/orderHelper.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ProcessRefundModalModule } from '../../../../components/process-refund-modal/process-refund-modal.module';
import { ProcessRefundModalComponent } from '../../../../components/process-refund-modal/process-refund-modal.component';
import { ProcessRefundModalService } from '../../../../components/process-refund-modal/process-refund-modal.service';

@NgModule({
  declarations: [RefundedOrdersComponent],
  imports: [
    RefundedOrdersRoutingModule,
    CommonModule,
    NgxPaginationModule,
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    ProcessRefundModalModule
  ],
  providers:[orderHelper,BsModalService,ProcessRefundModalService],
  entryComponents:[ProcessRefundModalComponent]
})
export class RefundedOrdersModule { }
