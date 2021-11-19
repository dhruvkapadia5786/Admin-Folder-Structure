import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';

import { TreatmentConditionListRoutingModule } from './treatment-condition-list-routing.module';
import { TreatmentConditionListComponent } from './treatment-condition-list.component';

import { TreatmentConditionAddEditModalComponent } from '../treatment-condition-add-edit-modal/treatment-condition-add-edit-modal.component';
import { TreatmentConditionAddEditModalModule } from '../treatment-condition-add-edit-modal/treatment-condition-add-edit-modal.module';

@NgModule({
  declarations: [
    TreatmentConditionListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forRoot(),
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    TreatmentConditionAddEditModalModule,
    TreatmentConditionListRoutingModule
  ],
  providers: [BsModalService],
  entryComponents: [TreatmentConditionAddEditModalComponent]
})
export class TreatmentConditionListModule { }
