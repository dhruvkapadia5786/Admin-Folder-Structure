import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { OtcSubcategoriesAddEditModalComponent } from './otc-subcategories-add-edit-modal.component';
import { OtcSubcategoriesAddEditModalService } from './otc-subcategories-add-edit-modal.service';

@NgModule({
  declarations: [
    OtcSubcategoriesAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[OtcSubcategoriesAddEditModalService, Helper],
  exports: [OtcSubcategoriesAddEditModalComponent]
})
export class OtcSubcategoriesAddEditModalModule { }
