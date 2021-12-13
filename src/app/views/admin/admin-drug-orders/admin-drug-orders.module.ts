import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDrugOrdersComponent } from './admin-drug-orders.component';
import { DrugOrdersListComponent } from './drug-orders-list/drug-orders-list.component';
import { DrugOrdersViewComponent } from './drug-orders-view/drug-orders-view.component';
import { RefundRequestedDrugOrdersComponent } from './refund-requested-drug-orders/refund-requested-drug-orders.component';
import { RefundProcessedDrugOrdersComponent } from './refund-processed-drug-orders/refund-processed-drug-orders.component';
import {AdminDrugOrdersRoutingModule} from './admin-drug-orders-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import {drugOrderHelper} from 'src/app/services/drugOrderHelper.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { OrderLogsModule } from '../common-components/order-logs/order-logs.module';

import { RefundDrugModalModule } from '../common-components/refund-drug-modal/refund-drug-modal.module';
import { RefundDrugModalComponent } from '../common-components/refund-drug-modal/refund-drug-modal.component';
import { RefundDrugModalService } from '../common-components/refund-drug-modal/refund-drug-modal.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [AdminDrugOrdersComponent, DrugOrdersListComponent, DrugOrdersViewComponent, RefundRequestedDrugOrdersComponent, RefundProcessedDrugOrdersComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    AdminDrugOrdersRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,MatCheckboxModule,
    ImagePreviewModule,
    NgxPaginationModule,
    OrderLogsModule,
    RefundDrugModalModule
  ],
  providers:[drugOrderHelper],
  entryComponents: [RefundDrugModalComponent]
})
export class AdminDrugOrdersModule { }
