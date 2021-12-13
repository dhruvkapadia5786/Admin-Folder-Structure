import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreatmentConditionViewRoutingModule } from './treatment-condition-view-routing.module';
import { TreatmentConditionViewComponent } from './treatment-condition-view.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { TreatmentConditionAddEditModalComponent } from '../treatment-condition-add-edit-modal/treatment-condition-add-edit-modal.component';
import { TreatmentConditionAddEditModalModule } from '../treatment-condition-add-edit-modal/treatment-condition-add-edit-modal.module';


@NgModule({
  declarations: [
    TreatmentConditionViewComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    FormsModule, ReactiveFormsModule,
    ModalModule.forRoot(),
    TreatmentConditionAddEditModalModule,
    TreatmentConditionViewRoutingModule
  ],
  providers: [BsModalService],
  entryComponents: [TreatmentConditionAddEditModalComponent]
})
export class TreatmentConditionViewModule { }
