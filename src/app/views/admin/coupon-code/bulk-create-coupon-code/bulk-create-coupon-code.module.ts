import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { BulkCreateCouponCodeRoutingModule } from './bulk-create-coupon-code-routing.module';
import { BulkCreateCouponCodeComponent } from './bulk-create-coupon-code.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [BulkCreateCouponCodeComponent],
  imports: [
    SharedModule,
    BsDatepickerModule.forRoot(),
		DatepickerModule.forRoot(),
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BulkCreateCouponCodeRoutingModule
  ]
})
export class BulkCreateCouponCodeModule { }
