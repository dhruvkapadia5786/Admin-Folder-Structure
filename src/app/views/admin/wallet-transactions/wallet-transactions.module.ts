import { NgModule } from '@angular/core';
import { WalletTransactionsRoutingModule } from './wallet-transactions-routing.module';
import { WalletTransactionsComponent } from './wallet-transactions.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [WalletTransactionsComponent],
  imports: [
    SharedModule,
    WalletTransactionsRoutingModule,
    DataTablesModule
  ]
})
export class WalletTransactionsModule { }
