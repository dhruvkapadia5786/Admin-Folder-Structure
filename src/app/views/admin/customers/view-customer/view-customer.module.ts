import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewCustomerRoutingModule } from './view-customer-routing.module';
import { ViewCustomerComponent } from './view-customer.component';
import { ViewCustomerService } from './view-customer.service';
import { ModalModule } from 'ngx-bootstrap/modal';

import { UploadMediaModalModule } from 'src/app/components/upload-media-modal/upload-media-modal.module';
import { UploadMediaModalComponent } from 'src/app/components/upload-media-modal/upload-media-modal.component';

@NgModule({
  declarations: [ViewCustomerComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    UploadMediaModalModule,
    ViewCustomerRoutingModule,
  ],
  providers: [ViewCustomerService],
  entryComponents: [UploadMediaModalComponent]
})
export class ViewCustomerModule { }
