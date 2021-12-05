import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactlensesTypesRoutingModule } from './contactlenses-types-routing.module';
import { ContactlensesTypesComponent } from './contactlenses-types.component';
import {ContactlensesTypesService} from './contactlenses-types.service'

import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ContactlensesTypesAddEditModalComponent } from '../contactlenses-types-add-edit-modal/contactlenses-types-add-edit-modal.component';
import { ContactlensesTypesAddEditModalModule } from '../contactlenses-types-add-edit-modal/contactlenses-types-add-edit-modal.module';

@NgModule({
  declarations: [ContactlensesTypesComponent],
  imports: [
  CommonModule,
    DataTablesModule,
    SharedModule,
    ModalModule.forRoot(),
    ContactlensesTypesRoutingModule,
    ContactlensesTypesAddEditModalModule
  ],
  providers:[ContactlensesTypesService,BsModalService],
  entryComponents:[ContactlensesTypesAddEditModalComponent]
})
export class ContactlensesTypesModule { }
