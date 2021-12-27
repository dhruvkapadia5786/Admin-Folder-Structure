import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PackformsRoutingModule } from './packforms-routing.module';
import { PackformsComponent } from './packforms.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {PackformsService} from './packforms.service'
import { BlockUIModule } from 'ng-block-ui';

import { PackformAddEditModalComponent } from './packform-add-edit-modal/packform-add-edit-modal.component';
import { PackformAddEditModalModule } from './packform-add-edit-modal/packform-add-edit-modal.module';
import { PackformAddEditModalService } from './packform-add-edit-modal/packform-add-edit-modal.service';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [PackformsComponent],
  imports:[
    CommonModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule,
    MatCheckboxModule,
    PackformsRoutingModule,
    ModalModule.forRoot(),
    PackformAddEditModalModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
  providers:[PackformsService,BsModalService,PackformAddEditModalService],
  entryComponents: [PackformAddEditModalComponent]
})
export class PackformsModule { }
