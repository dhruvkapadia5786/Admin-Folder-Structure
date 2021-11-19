import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { StatesRoutingModule } from './states-routing.module';
import { StatesComponent } from './states.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {StatesService} from './states.service'
import { BlockUIModule } from 'ng-block-ui';

import { StateAddEditModalComponent } from './state-add-edit-modal/state-add-edit-modal.component';
import { StateAddEditModalModule } from './state-add-edit-modal/state-add-edit-modal.module';
import { StateAddEditModalService } from './state-add-edit-modal/state-add-edit-modal.service';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [StatesComponent],
  imports:[
    CommonModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule,
    MatCheckboxModule,
    StatesRoutingModule,
    ModalModule.forRoot(),
    StateAddEditModalModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
  providers:[StatesService,BsModalService,StateAddEditModalService],
  entryComponents: [StateAddEditModalComponent]
})
export class StatesModule { }
