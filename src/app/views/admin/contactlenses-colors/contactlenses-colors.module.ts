
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactlensesColorsRoutingModule } from './contactlenses-colors-routing.module';
import { ContactlensesColorsComponent } from './contactlenses-colors.component';
import {ContactlensesColorsService} from './contactlenses-colors.service'

import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ContactlensesColorAddEditModalComponent } from '../contactlenses-color-add-edit-modal/contactlenses-color-add-edit-modal.component';
import { ContactlensesColorAddEditModalModule } from '../contactlenses-color-add-edit-modal/contactlenses-color-add-edit-modal.module';

@NgModule({
  declarations: [ContactlensesColorsComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    SharedModule,
    ModalModule.forRoot(),
    ContactlensesColorsRoutingModule,
    ContactlensesColorAddEditModalModule
  ],
  providers:[ContactlensesColorsService,BsModalService],
  entryComponents:[ContactlensesColorAddEditModalComponent]
})
export class ContactlensesColorsModule { }
