import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';

import { OtcCategoriesListRoutingModule } from './otc-categories-list-routing.module';
import { OtcCategoriesListComponent } from './otc-categories-list.component';

import { OtcCategoriesAddEditModalComponent } from '../otc-categories-add-edit-modal/otc-categories-add-edit-modal.component';
import { OtcCategoriesAddEditModalModule } from '../otc-categories-add-edit-modal/otc-categories-add-edit-modal.module';

@NgModule({
  declarations: [
    OtcCategoriesListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    OtcCategoriesAddEditModalModule,
    OtcCategoriesListRoutingModule
  ],
  providers: [BsModalService],
  entryComponents: [OtcCategoriesAddEditModalComponent]
})
export class OtcCategoriesListModule { }
