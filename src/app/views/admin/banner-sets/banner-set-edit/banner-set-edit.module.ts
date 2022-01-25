import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerSetEditRoutingModule } from './banner-set-edit-routing.module';
import { BannerSetEditComponent } from './banner-set-edit.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { Toastr } from 'src/app/services/toastr.service';
import { BannerlinkModalModule } from '../bannerlink-modal/bannerlink-modal.module';
import { BannerlinkModalComponent } from '../bannerlink-modal/bannerlink-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';


@NgModule({
  declarations: [
    BannerSetEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    ImagePreviewModule,
    BannerlinkModalModule,
    BannerSetEditRoutingModule
  ],
  providers:[Helper,Toastr],
  entryComponents:[BannerlinkModalComponent]
})
export class BannerSetEditModule { }
