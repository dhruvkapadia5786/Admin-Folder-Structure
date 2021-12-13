import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CouponCodeRoutingModule } from './coupon-code-routing.module';
import { CouponCodeComponent } from './coupon-code.component';

@NgModule({
  declarations: [CouponCodeComponent],
  imports: [
    SharedModule,
    CouponCodeRoutingModule
  ]
})
export class CouponCodeModule { }
