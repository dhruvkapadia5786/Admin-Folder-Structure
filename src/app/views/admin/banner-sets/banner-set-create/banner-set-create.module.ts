import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerSetCreateRoutingModule } from './banner-set-create-routing.module';
import { BannerSetCreateComponent } from './banner-set-create.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { Toastr } from 'src/app/services/toastr.service';
import { BannerlinkModalModule } from '../bannerlink-modal/bannerlink-modal.module';
import { BannerlinkModalComponent } from '../bannerlink-modal/bannerlink-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    BannerSetCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    ModalModule.forRoot(),
    BannerlinkModalModule,
    BannerSetCreateRoutingModule
  ],
  providers:[Helper,Toastr],
  entryComponents:[BannerlinkModalComponent]
})
export class BannerSetCreateModule { }
