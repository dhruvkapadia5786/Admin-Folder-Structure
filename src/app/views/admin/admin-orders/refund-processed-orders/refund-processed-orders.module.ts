import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundProcessedOrdersComponent } from './refund-processed-orders.component';
import {RefundProcessedOrdersRoutingModule} from './refund-processed-orders-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [RefundProcessedOrdersComponent],
  imports: [
    RefundProcessedOrdersRoutingModule,
    CommonModule,
    DataTablesModule,
    BlockUIModule.forRoot({message:'Loading ...'})
  ],
  providers:[Helper]
})
export class RefundProcessedOrdersModule { }
