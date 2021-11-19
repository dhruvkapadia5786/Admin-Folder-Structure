import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ListCustomerRoutingModule } from './list-customer-routing.module';
import { ListCustomerComponent } from './list-customer.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [ListCustomerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule, 
    MatSelectModule,
    ListCustomerRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    BlockUIModule.forRoot({ message: 'Loading...' })
  ],
  providers: [Helper]
})
export class ListCustomerModule { }
