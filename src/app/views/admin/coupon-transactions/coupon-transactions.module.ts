import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponTransactionsRoutingModule } from './coupon-transactions-routing.module';
import { CouponTransactionsComponent } from './coupon-transactions.component';
import { NgxMaskModule } from 'ngx-mask';
import { BlockUIModule } from 'ng-block-ui';
import { DataTablesModule } from 'angular-datatables';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [CouponTransactionsComponent],
  imports: [
  CommonModule,
    CouponTransactionsRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    BlockUIModule.forRoot({message:'Loading ...'})
  ],
  providers:[Helper]
})
export class CouponTransactionsModule { }
