import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { OtcCategoryInfoRoutingModule } from './otc-category-info-routing.module';
import { OtcCategoryInfoComponent } from './otc-category-info.component';
import {ImagePreviewModule} from 'src/app/shared/image-preview/image-preview.module';
import { ChangeSequenceModule } from 'src/app/shared/change-sequence/change-sequence.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OtcCategoriesAddEditModalComponent } from '../../otc-categories-add-edit-modal/otc-categories-add-edit-modal.component';
import { OtcCategoriesAddEditModalModule } from '../../otc-categories-add-edit-modal/otc-categories-add-edit-modal.module';

@NgModule({
  declarations: [OtcCategoryInfoComponent],
  imports: [
    SharedModule,
    OtcCategoryInfoRoutingModule,
    ImagePreviewModule,
    ChangeSequenceModule,
    ModalModule.forRoot(),
    OtcCategoriesAddEditModalModule
  ],
  entryComponents:[OtcCategoriesAddEditModalComponent]
})
export class OtcCategoryInfoModule { }
