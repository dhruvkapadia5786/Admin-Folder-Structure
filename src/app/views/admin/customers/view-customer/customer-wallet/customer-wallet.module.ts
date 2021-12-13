import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerWalletRoutingModule } from './customer-wallet-routing.module';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { CustomerWalletComponent } from './customer-wallet.component';
import { BlockUIModule } from 'ng-block-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [CustomerWalletComponent],
  imports: [
    CommonModule,
    CustomerWalletRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    }),
    DataTablesModule
  ],
  providers:[Helper]
})
export class CustomerWalletModule { }
