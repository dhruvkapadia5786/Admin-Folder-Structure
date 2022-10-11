import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CustomerInfoRoutingModule } from './customer-info-routing.module';
import { CustomerInfoComponent } from './customer-info.component';

import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';

import { CustomImageCropperModule } from 'src/app/components/custom-image-cropper/custom-image-cropper.module';
import { CustomImageCropperComponent } from 'src/app/components/custom-image-cropper/custom-image-cropper.component';

import { ChangeAddressModalModule } from 'src/app/components/change-address-modal/change-address-modal.module';
import { ChangeAddressModalComponent } from 'src/app/components/change-address-modal/change-address-modal.component';

import { ChangePasswordModalModule } from 'src/app/components/change-password-modal/change-password-modal.module';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';


@NgModule({
  declarations: [
    CustomerInfoComponent
  ],
  imports: [
    CommonModule,
    ImagePreviewModule,
    ModalModule.forRoot(),
    NgxMaskModule.forChild(),
    CustomImageCropperModule,
    ChangePasswordModalModule,
    ChangeAddressModalModule,
    CustomerInfoRoutingModule
  ],
  entryComponents: [CustomImageCropperComponent, ChangeAddressModalComponent, ChangePasswordModalComponent]
})
export class CustomerInfoModule { }
