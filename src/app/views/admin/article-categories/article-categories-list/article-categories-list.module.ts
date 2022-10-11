import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';

import { ArticleCategoriesListRoutingModule } from './article-categories-list-routing.module';
import { ArticleCategoriesListComponent } from './article-categories-list.component';

import { ArticleCategoriesAddEditModalComponent } from '../article-categories-add-edit-modal/article-categories-add-edit-modal.component';
import { ArticleCategoriesAddEditModalModule } from '../article-categories-add-edit-modal/article-categories-add-edit-modal.module';

@NgModule({
  declarations: [
    ArticleCategoriesListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    ArticleCategoriesAddEditModalModule,
    ArticleCategoriesListRoutingModule
  ],
  providers: [BsModalService],
  entryComponents: [ ArticleCategoriesAddEditModalComponent]
})
export class ArticleCategoriesListModule { }
