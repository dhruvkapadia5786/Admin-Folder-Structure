import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { FAQGroupRoutingModule } from './faq-group-routing.module';
import { FAQGroupComponent } from './faq-group.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {FAQGroupService} from './faq-group.service'
import { BlockUIModule } from 'ng-block-ui';

import { FAQGroupAddEditModalComponent } from './faq-group-add-edit-modal/faq-group-add-edit-modal.component';
import { FAQGroupAddEditModalModule } from './faq-group-add-edit-modal/faq-group-add-edit-modal.module';
import { FAQGroupAddEditModalService } from './faq-group-add-edit-modal/faq-group-add-edit-modal.service';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [FAQGroupComponent],
  imports:[
    CommonModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule,
    MatCheckboxModule,
    FAQGroupRoutingModule,
    ModalModule.forRoot(),
    FAQGroupAddEditModalModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
  providers:[FAQGroupService,BsModalService,FAQGroupAddEditModalService],
  entryComponents: [FAQGroupAddEditModalComponent]
})
export class FAQGroupModule { }
