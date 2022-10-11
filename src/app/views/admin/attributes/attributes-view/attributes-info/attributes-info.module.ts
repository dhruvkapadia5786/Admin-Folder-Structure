import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { AttributesRoutingModule } from './attributes-info-routing.module';
import { AttributesInfoComponent } from './attributes-info.component';
import {ImagePreviewModule} from 'src/app/shared/image-preview/image-preview.module';
import { ChangeSequenceModule } from 'src/app/shared/change-sequence/change-sequence.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AttributesAddEditModalComponent } from '../../attributes-add-edit-modal/attributes-add-edit-modal.component';
import { AttributesAddEditModalModule } from '../../attributes-add-edit-modal/attributes-add-edit-modal.module';

@NgModule({
  declarations: [AttributesInfoComponent],
  imports: [
    SharedModule,
    AttributesRoutingModule,
    ImagePreviewModule,
    ChangeSequenceModule,
    ModalModule.forRoot(),
    AttributesAddEditModalModule
  ],
  entryComponents:[AttributesAddEditModalComponent]
})
export class AttributesInfoModule { }
