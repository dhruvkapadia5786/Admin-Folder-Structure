import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { FAQGroupAddEditModalComponent } from './faq-group-add-edit-modal.component';
import { FAQGroupAddEditModalService } from './faq-group-add-edit-modal.service';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    FAQGroupAddEditModalComponent
  ],
  imports: [
    SharedModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers:[FAQGroupAddEditModalService, Helper],
  exports: [FAQGroupAddEditModalComponent]
})
export class FAQGroupAddEditModalModule { }
