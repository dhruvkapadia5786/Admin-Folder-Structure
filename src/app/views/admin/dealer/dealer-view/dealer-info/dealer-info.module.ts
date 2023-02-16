import { NgModule } from '@angular/core';

import { DealerInfoRoutingModule } from './dealer-info-routing.module';
import { DealerInfoComponent } from './dealer-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { AccountVerifyModalModule } from 'src/app/components/account-verify-modal/account-verify-modal.module';


@NgModule({
  declarations:[
    DealerInfoComponent
  ],
  imports:[
    SharedModule,
    ImagePreviewModule,
    AccountVerifyModalModule,
    DealerInfoRoutingModule
  ]
})
export class DealerInfoModule { }
