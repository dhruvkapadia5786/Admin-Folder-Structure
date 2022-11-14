import { NgModule } from '@angular/core';

import { BannerSetCreateRoutingModule } from './banner-set-create-routing.module';
import { BannerSetCreateComponent } from './banner-set-create.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BannerlinkModalModule } from '../bannerlink-modal/bannerlink-modal.module';
import { BannerlinkModalComponent } from '../bannerlink-modal/bannerlink-modal.component';


@NgModule({
  declarations: [
    BannerSetCreateComponent
  ],
  imports: [
    SharedModule,
    BannerlinkModalModule,
    BannerSetCreateRoutingModule
  ],
  entryComponents:[BannerlinkModalComponent]
})
export class BannerSetCreateModule { }
