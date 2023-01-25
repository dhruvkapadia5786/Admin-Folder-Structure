import { NgModule } from '@angular/core';

import { DealerInfoRoutingModule } from './dealer-info-routing.module';
import { DealerInfoComponent } from './dealer-info.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';


@NgModule({
  declarations:[
    DealerInfoComponent
  ],
  imports:[
    SharedModule,
    ImagePreviewModule,
    DealerInfoRoutingModule
  ]
})
export class DealerInfoModule { }
