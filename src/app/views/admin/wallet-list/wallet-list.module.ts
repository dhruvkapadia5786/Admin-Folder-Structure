import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WalletListComponent } from './wallet-list.component';
import {WalletListRoutingModule} from './wallet-list-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { WalletAddFundModalModule } from '../wallet-add-fund-modal/wallet-add-fund-modal.module';
import { WalletAddFundModalComponent } from '../wallet-add-fund-modal/wallet-add-fund-modal.component';

@NgModule({
  declarations: [WalletListComponent],
  imports: [
  SharedModule,
    DataTablesModule,
    WalletListRoutingModule,
    ModalModule.forRoot(),
    WalletAddFundModalModule
  ],
  providers:[BsModalService],
  entryComponents:[WalletAddFundModalComponent]
})
export class WalletListModule { }
