import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewCouponCodeRoutingModule } from './view-coupon-code-routing.module';
import { ViewCouponCodeComponent } from './view-coupon-code.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ViewCouponCodeComponent],
  imports: [
    SharedModule,
    ViewCouponCodeRoutingModule,
    DataTablesModule
  ]
})
export class ViewCouponCodeModule { }
