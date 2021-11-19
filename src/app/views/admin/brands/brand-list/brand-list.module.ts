import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';

import { BrandListRoutingModule } from './brand-list-routing.module';
import { BrandListComponent } from './brand-list.component';

import { BrandAddEditModalComponent } from '../brand-add-edit-modal/brand-add-edit-modal.component';
import { BrandAddEditModalModule } from '../brand-add-edit-modal/brand-add-edit-modal.module';

@NgModule({
  declarations: [
    BrandListComponent
  ],
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    DataTablesModule,
    BrandAddEditModalModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    }),
    BrandListRoutingModule
  ],
  providers: [BsModalService],
  entryComponents: [BrandAddEditModalComponent]
})
export class BrandListModule { }
