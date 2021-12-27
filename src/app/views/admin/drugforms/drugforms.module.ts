import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { DrugFormsRoutingModule } from './drugforms-routing.module';
import { DrugFormsComponent } from './drugforms.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {DrugFormsService} from './drugforms.service'
import { BlockUIModule } from 'ng-block-ui';

import { DrugFormAddEditModalComponent } from './drugform-add-edit-modal/drugform-add-edit-modal.component';
import { DrugFormAddEditModalModule } from './drugform-add-edit-modal/drugform-add-edit-modal.module';
import { DrugFormAddEditModalService } from './drugform-add-edit-modal/drugform-add-edit-modal.service';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [DrugFormsComponent],
  imports:[
    CommonModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule,
    MatCheckboxModule,
    DrugFormsRoutingModule,
    ModalModule.forRoot(),
    DrugFormAddEditModalModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
  providers:[DrugFormsService,BsModalService,DrugFormAddEditModalService],
  entryComponents: [DrugFormAddEditModalComponent]
})
export class DrugFormsModule { }
