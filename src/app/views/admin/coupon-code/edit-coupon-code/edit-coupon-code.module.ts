import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EditCouponCodeRoutingModule } from './edit-coupon-code-routing.module';
import { EditCouponCodeComponent } from './edit-coupon-code.component';
import { MatRadioModule } from '@angular/material/radio';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [EditCouponCodeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditCouponCodeRoutingModule,
    MatCheckboxModule,
    MatSelectModule,
    BsDatepickerModule.forRoot(),
		DatepickerModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatRadioModule
  ]
})
export class EditCouponCodeModule { }
