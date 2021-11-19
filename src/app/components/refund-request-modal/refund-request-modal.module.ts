import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundRequestModalComponent } from './refund-request-modal.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [RefundRequestModalComponent],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule
  ],
  exports:[RefundRequestModalComponent]
})
export class RefundRequestModalModule { }
