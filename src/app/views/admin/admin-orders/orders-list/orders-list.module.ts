import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrdersListRoutingModule } from './orders-list-routing.module';
import { OrdersListComponent } from './orders-list.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { orderHelper } from 'src/app/services/orderHelper.service';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [OrdersListComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule, 
    MatSelectModule,
    OrdersListRoutingModule,
    NgxMaskModule,
    DataTablesModule
  ],
  providers:[orderHelper, Helper]
})
export class OrdersListModule { }
