import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { SubcategoriesAddEditModalComponent } from './subcategories-add-edit-modal.component';
import { SubcategoriesAddEditModalService } from './subcategories-add-edit-modal.service';

@NgModule({
  declarations: [
    SubcategoriesAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[SubcategoriesAddEditModalService, Helper],
  exports: [SubcategoriesAddEditModalComponent]
})
export class SubcategoriesAddEditModalModule { }
