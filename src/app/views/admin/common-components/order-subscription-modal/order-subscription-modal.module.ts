import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSubscriptionModalComponent } from './order-subscription-modal.component';
import {OrderSubscriptionModalService} from './order-subscription-modal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [OrderSubscriptionModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  providers:[OrderSubscriptionModalService],
  exports:[OrderSubscriptionModalComponent]
})
export class OrderSubscriptionModalModule { }
