import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugOrderSubscriptionModalComponent } from './drug-order-subscription-modal.component';
import {DrugOrderSubscriptionModalService} from './drug-order-subscription-modal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DrugOrderSubscriptionModalComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers:[DrugOrderSubscriptionModalService],
  exports:[DrugOrderSubscriptionModalComponent]
})
export class DrugOrderSubscriptionModalModule { }
