import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RefundDrugModalComponent } from './refund-drug-modal.component';
import { RefundDrugModalService } from './refund-drug-modal.service';

@NgModule({
  declarations: [
    RefundDrugModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  providers:[RefundDrugModalService],
  exports:[RefundDrugModalComponent]
})
export class RefundDrugModalModule { }
