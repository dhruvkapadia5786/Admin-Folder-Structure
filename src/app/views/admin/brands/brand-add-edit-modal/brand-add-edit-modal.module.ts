import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { BrandAddEditModalComponent } from './brand-add-edit-modal.component';
import { BrandAddEditModalService } from './brand-add-edit-modal.service';

@NgModule({
  declarations: [
    BrandAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[BrandAddEditModalService, Helper],
  exports:[BrandAddEditModalComponent]
})
export class BrandAddEditModalModule { }
