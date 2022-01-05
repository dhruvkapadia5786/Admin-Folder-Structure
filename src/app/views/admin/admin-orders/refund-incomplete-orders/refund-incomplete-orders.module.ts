import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundIncompleteOrdersComponent } from './refund-incomplete-orders.component';
import { RefundIncompleteOrdersRoutingModule } from './refund-incomplete-orders-routing.module';
import { BlockUIModule } from 'ng-block-ui';
import {FormsModule} from '@angular/forms';
import {orderHelper} from 'src/app/services/orderHelper.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ProcessRefundModalModule } from '../../../../components/process-refund-modal/process-refund-modal.module';
import { ProcessRefundModalComponent } from '../../../../components/process-refund-modal/process-refund-modal.component';
import { ProcessRefundModalService } from '../../../../components/process-refund-modal/process-refund-modal.service';

@NgModule({
  declarations: [RefundIncompleteOrdersComponent],
  imports: [
    RefundIncompleteOrdersRoutingModule,
    CommonModule,
    BlockUIModule,
    NgxPaginationModule,
    FormsModule,
    ModalModule.forRoot(),
    ProcessRefundModalModule
  ],
  providers:[orderHelper,BsModalService,ProcessRefundModalService],
  entryComponents:[ProcessRefundModalComponent]
})
export class RefundIncompleteOrdersModule { }
