import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferralTransactionsRoutingModule } from './referral-transactions-routing.module';
import { ReferralTransactionsComponent } from './referral-transactions.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [ReferralTransactionsComponent],
  imports: [
    CommonModule,
    ReferralTransactionsRoutingModule,
    NgxMaskModule,
    DataTablesModule
  ],
  providers:[Helper]
})
export class ReferralTransactionsModule { }
