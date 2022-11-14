import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewCustomerRoutingModule } from './view-customer-routing.module';
import { ViewCustomerComponent } from './view-customer.component';
import { ViewCustomerService } from './view-customer.service';

import { UploadMediaModalModule } from 'src/app/components/upload-media-modal/upload-media-modal.module';
import { UploadMediaModalComponent } from 'src/app/components/upload-media-modal/upload-media-modal.component';

@NgModule({
  declarations: [ViewCustomerComponent],
  imports: [
    SharedModule,
    UploadMediaModalModule,
    ViewCustomerRoutingModule,
  ],
  providers: [ViewCustomerService],
  entryComponents: [UploadMediaModalComponent]
})
export class ViewCustomerModule { }
