import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrugOrdersRoutingModule } from './drug-orders-routing.module';
import { DrugOrdersComponent } from './drug-orders.component';
import { NgxMaskModule } from 'ngx-mask';
import {NgxPaginationModule} from 'ngx-pagination';
import {orderHelper} from 'src/app/services/orderHelper.service';

@NgModule({
  declarations: [DrugOrdersComponent],
  imports: [
    CommonModule,
    DrugOrdersRoutingModule,
    NgxMaskModule,
    NgxPaginationModule
  ],
  providers:[orderHelper]
})
export class DrugOrdersModule { }
