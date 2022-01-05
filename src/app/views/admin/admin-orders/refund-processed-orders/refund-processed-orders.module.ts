import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundProcessedOrdersComponent } from './refund-processed-orders.component';
import {RefundProcessedOrdersRoutingModule} from './refund-processed-orders-routing.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {orderHelper} from 'src/app/services/orderHelper.service';
import {FormsModule} from '@angular/forms';
@NgModule({
  declarations: [RefundProcessedOrdersComponent],
  imports: [
    RefundProcessedOrdersRoutingModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers:[orderHelper]
})
export class RefundProcessedOrdersModule { }
