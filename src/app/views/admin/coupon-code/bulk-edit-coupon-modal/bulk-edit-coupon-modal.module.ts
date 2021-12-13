import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { BulkEditCouponModalComponent } from './bulk-edit-coupon-modal.component';

@NgModule({
  declarations: [
    BulkEditCouponModalComponent
  ],
  imports: [
    SharedModule,
    MatRadioModule,
    MatCheckboxModule, 
    BsDatepickerModule.forRoot(),
  ]
})
export class BulkEditCouponModalModule { }
