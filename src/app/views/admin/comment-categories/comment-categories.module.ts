import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';

import { CommentCategoriesRoutingModule } from './comment-categories-routing.module';
import { CommentCategoriesComponent } from './comment-categories.component';

import { CommentCategoryAddEditModalComponent } from './comment-category-add-edit-modal/comment-category-add-edit-modal.component';
import { CommentCategoryAddEditModalModule } from './comment-category-add-edit-modal/comment-category-add-edit-modal.module';
import { CommentCategoryAddEditModalService } from './comment-category-add-edit-modal/comment-category-add-edit-modal.service';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [CommentCategoriesComponent],
  imports: [
  CommonModule,
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    }),
    ModalModule.forRoot(),
    CommentCategoryAddEditModalModule,
    CommentCategoriesRoutingModule
  ],
  providers: [BsModalService,CommentCategoryAddEditModalService],
  entryComponents: [CommentCategoryAddEditModalComponent]
})
export class CommentCategoriesModule { }
