import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ListCouponCodeRoutingModule } from './list-coupon-code-routing.module';
import { ListCouponCodeComponent } from './list-coupon-code.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ConfirmDeleteCouponModalModule } from '../confirm-delete-coupon-modal/confirm-delete-coupon-modal.module';
import { ConfirmDeleteCouponModalComponent } from '../confirm-delete-coupon-modal/confirm-delete-coupon-modal.component';
import { BulkEditCouponModalModule } from '../bulk-edit-coupon-modal/bulk-edit-coupon-modal.module';
import { BulkEditCouponModalComponent } from '../bulk-edit-coupon-modal/bulk-edit-coupon-modal.component';

@NgModule({
  declarations: [ListCouponCodeComponent],
  imports: [
    SharedModule,
    ListCouponCodeRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    MatTabsModule,
    MatSelectModule,
    ModalModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    ConfirmDeleteCouponModalModule,
    BulkEditCouponModalModule
  ],
  entryComponents: [ConfirmDeleteCouponModalComponent, BulkEditCouponModalComponent]
})
export class ListCouponCodeModule { }
