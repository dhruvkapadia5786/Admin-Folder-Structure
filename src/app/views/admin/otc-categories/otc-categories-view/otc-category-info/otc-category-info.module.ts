import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { OtcCategoryInfoRoutingModule } from './otc-category-info-routing.module';
import { OtcCategoryInfoComponent } from './otc-category-info.component';
import {ImagePreviewModule} from 'src/app/shared/image-preview/image-preview.module';

@NgModule({
  declarations: [OtcCategoryInfoComponent],
  imports: [
    SharedModule,
    OtcCategoryInfoRoutingModule,
    ImagePreviewModule
  ]
})
export class OtcCategoryInfoModule { }
