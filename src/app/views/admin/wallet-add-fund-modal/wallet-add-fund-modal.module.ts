import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletAddFundModalComponent } from './wallet-add-fund-modal.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { WalletAddFundModalService } from './wallet-add-fund-modal.service';

@NgModule({
  declarations: [
    WalletAddFundModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[WalletAddFundModalService],
  exports:[WalletAddFundModalComponent]
})
export class WalletAddFundModalModule { }
