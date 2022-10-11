import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { ArticleCategoriesAddEditModalComponent } from './article-categories-add-edit-modal.component';
import { ArticleCategoriesAddEditModalService } from './article-categories-add-edit-modal.service';

@NgModule({
  declarations: [
    ArticleCategoriesAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[ArticleCategoriesAddEditModalService, Helper],
  exports: [ArticleCategoriesAddEditModalComponent]
})
export class ArticleCategoriesAddEditModalModule { }
