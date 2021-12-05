import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { Helper } from 'src/app/services/helper.service';

import { TreatmentConditionAddEditModalComponent } from './treatment-condition-add-edit-modal.component';
import { TreatmentConditionAddEditModalService } from './treatment-condition-add-edit-modal.service';

@NgModule({
  declarations: [
    TreatmentConditionAddEditModalComponent
  ],
  imports: [
  CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule
  ],
  providers:[TreatmentConditionAddEditModalService, Helper],
  exports: [TreatmentConditionAddEditModalComponent]
})
export class TreatmentConditionAddEditModalModule { }
