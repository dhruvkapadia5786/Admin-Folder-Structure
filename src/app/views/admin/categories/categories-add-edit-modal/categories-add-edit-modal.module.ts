import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { CategoriesAddEditModalComponent } from './categories-add-edit-modal.component';
import { CategoriesAddEditModalService } from './categories-add-edit-modal.service';

@NgModule({
  declarations: [
    CategoriesAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[CategoriesAddEditModalService, Helper],
  exports: [CategoriesAddEditModalComponent]
})
export class CategoriesAddEditModalModule { }
