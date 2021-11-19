import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundIncompleteOrdersComponent } from './refund-incomplete-orders.component';
import { RefundIncompleteOrdersRoutingModule } from './refund-incomplete-orders-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [RefundIncompleteOrdersComponent],
  imports: [
    RefundIncompleteOrdersRoutingModule,
    CommonModule,
    ModalModule.forRoot(),
    DataTablesModule,
    BlockUIModule
  ]
})
export class RefundIncompleteOrdersModule { }
