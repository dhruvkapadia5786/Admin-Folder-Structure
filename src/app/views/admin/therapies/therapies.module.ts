import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { TherapiesRoutingModule } from './therapies-routing.module';
import { TherapiesComponent } from './therapies.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {TherapiesService} from './therapies.service'
import { BlockUIModule } from 'ng-block-ui';

import { TherapyAddEditModalComponent } from './therapy-add-edit-modal/therapy-add-edit-modal.component';
import { TherapyAddEditModalModule } from './therapy-add-edit-modal/therapy-add-edit-modal.module';
import { TherapyAddEditModalService } from './therapy-add-edit-modal/therapy-add-edit-modal.service';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [TherapiesComponent],
  imports:[
    CommonModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule,
    MatCheckboxModule,
    TherapiesRoutingModule,
    ModalModule.forRoot(),
    TherapyAddEditModalModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
  providers:[TherapiesService,BsModalService,TherapyAddEditModalService],
  entryComponents: [TherapyAddEditModalComponent]
})
export class TherapiesModule { }
