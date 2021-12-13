import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtcSubscriptionModalComponent } from './otc-subscription-modal.component';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {OtcSubscriptionModalService} from './otc-subscription-modal.service';

@NgModule({
  declarations: [OtcSubscriptionModalComponent],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  providers:[OtcSubscriptionModalService]
})
export class OtcSubscriptionModalModule { }
