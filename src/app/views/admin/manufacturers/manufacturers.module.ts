import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ManufacturersRoutingModule } from './manufacturers-routing.module';
import { ManufacturersComponent } from './manufacturers.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {ManufacturersService} from './manufacturers.service'
import { BlockUIModule } from 'ng-block-ui';

import { ManufacturerAddEditModalComponent } from './manufacturer-add-edit-modal/manufacturer-add-edit-modal.component';
import { ManufacturerAddEditModalModule } from './manufacturer-add-edit-modal/manufacturer-add-edit-modal.module';
import { ManufacturerAddEditModalService } from './manufacturer-add-edit-modal/manufacturer-add-edit-modal.service';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [ManufacturersComponent],
  imports:[
    CommonModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule,
    MatCheckboxModule,
    ManufacturersRoutingModule,
    ModalModule.forRoot(),
    ManufacturerAddEditModalModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
  providers:[ManufacturersService,BsModalService,ManufacturerAddEditModalService],
  entryComponents: [ManufacturerAddEditModalComponent]
})
export class ManufacturersModule { }
