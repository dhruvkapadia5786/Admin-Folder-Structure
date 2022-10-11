import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { AttributesAddEditModalComponent } from './attributes-add-edit-modal.component';
import { AttributesAddEditModalService } from './attributes-add-edit-modal.service';

@NgModule({
  declarations: [
    AttributesAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[AttributesAddEditModalService, Helper],
  exports: [AttributesAddEditModalComponent]
})
export class AttributesAddEditModalModule { }
