import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';

import { AttributesListRoutingModule } from './attributes-list-routing.module';
import { AttributesListComponent } from './attributes-list.component';

import { AttributesAddEditModalComponent } from '../attributes-add-edit-modal/attributes-add-edit-modal.component';
import { AttributesAddEditModalModule } from '../attributes-add-edit-modal/attributes-add-edit-modal.module';

@NgModule({
  declarations: [
    AttributesListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    AttributesAddEditModalModule,
    AttributesListRoutingModule
  ],
  providers: [BsModalService],
  entryComponents: [ AttributesAddEditModalComponent]
})
export class AttributesListModule { }
