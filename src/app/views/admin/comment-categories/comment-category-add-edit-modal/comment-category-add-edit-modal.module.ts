import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { CommentCategoryAddEditModalComponent } from './comment-category-add-edit-modal.component';
import { CommentCategoryAddEditModalService } from './comment-category-add-edit-modal.service';

@NgModule({
  declarations: [
    CommentCategoryAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[CommentCategoryAddEditModalService, Helper],
  exports: [CommentCategoryAddEditModalComponent]
})
export class CommentCategoryAddEditModalModule { }
