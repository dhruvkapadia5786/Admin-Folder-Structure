import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { orderHelper } from 'src/app/services/orderHelper.service';

@NgModule({
  declarations: [OrdersComponent],
  imports: [
  CommonModule,
    OrdersRoutingModule,
    NgxMaskModule,
    DataTablesModule
  ],
  providers:[orderHelper]
})
export class OrdersModule { }
