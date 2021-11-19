import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundedOrdersComponent } from './refunded-orders.component';
import { RefundedOrdersRoutingModule } from './refunded-orders-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [RefundedOrdersComponent],
  imports: [
    RefundedOrdersRoutingModule,
    CommonModule,
    DataTablesModule,
    ModalModule.forRoot(),
    BlockUIModule
  ]
})
export class RefundedOrdersModule { }
