import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { OtcCategoriesAddEditModalComponent } from './otc-categories-add-edit-modal.component';
import { OtcCategoriesAddEditModalService } from './otc-categories-add-edit-modal.service';

@NgModule({
  declarations: [
    OtcCategoriesAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[OtcCategoriesAddEditModalService, Helper],
  exports: [OtcCategoriesAddEditModalComponent]
})
export class OtcCategoriesAddEditModalModule { }
