import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundProcessedOrdersComponent } from './refund-processed-orders.component';
import {RefundProcessedOrdersRoutingModule} from './refund-processed-orders-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [RefundProcessedOrdersComponent],
  imports: [
    RefundProcessedOrdersRoutingModule,
    CommonModule,
    DataTablesModule,
    BlockUIModule
  ]
})
export class RefundProcessedOrdersModule { }
