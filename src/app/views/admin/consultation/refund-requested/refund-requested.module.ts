import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundRequestedComponent } from './refund-requested.component';
import { RefundRequestedRoutingModule } from './refund-requested-routing.module';
import { BlockUIModule } from 'ng-block-ui';
import {NgxPaginationModule} from 'ngx-pagination';
import { consultationHelper } from 'src/app/services/consultationHelper.service';
import { FormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ProcessRefundModalModule } from '../../../../components/process-refund-modal/process-refund-modal.module';
import { ProcessRefundModalComponent } from '../../../../components/process-refund-modal/process-refund-modal.component';
import { ProcessRefundModalService } from '../../../../components/process-refund-modal/process-refund-modal.service';

@NgModule({
  declarations: [RefundRequestedComponent],
  imports: [
  RefundRequestedRoutingModule,
    CommonModule,
    FormsModule,
    BlockUIModule.forRoot({message:'Loading ...'}),
    NgxPaginationModule,
    ModalModule.forRoot(),
    ProcessRefundModalModule
  ],
  providers:[BsModalService,consultationHelper,ProcessRefundModalService],
  entryComponents:[ProcessRefundModalComponent]
})
export class RefundRequestedModule { }
