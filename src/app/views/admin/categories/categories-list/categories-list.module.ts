import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';

import { CategoriesListRoutingModule } from './categories-list-routing.module';
import { CategoriesListComponent } from './categories-list.component';

import { CategoriesAddEditModalComponent } from '../categories-add-edit-modal/categories-add-edit-modal.component';
import { CategoriesAddEditModalModule } from '../categories-add-edit-modal/categories-add-edit-modal.module';

@NgModule({
  declarations: [
    CategoriesListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    CategoriesAddEditModalModule,
    CategoriesListRoutingModule
  ],
  providers: [BsModalService],
  entryComponents: [CategoriesAddEditModalComponent]
})
export class CategoriesListModule { }
