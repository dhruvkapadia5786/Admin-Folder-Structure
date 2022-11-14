import { NgModule } from '@angular/core';

import { BannerSetEditRoutingModule } from './banner-set-edit-routing.module';
import { BannerSetEditComponent } from './banner-set-edit.component';
import { BannerlinkModalModule } from '../bannerlink-modal/bannerlink-modal.module';
import { BannerlinkModalComponent } from '../bannerlink-modal/bannerlink-modal.component';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BannerSetEditComponent
  ],
  imports: [
    SharedModule,
    ImagePreviewModule,
    BannerlinkModalModule,
    BannerSetEditRoutingModule
  ],
  entryComponents:[BannerlinkModalComponent]
})
export class BannerSetEditModule { }
