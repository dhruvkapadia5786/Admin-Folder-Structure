import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { DrugFormAddEditModalComponent } from './drugform-add-edit-modal.component';
import { DrugFormAddEditModalService } from './drugform-add-edit-modal.service';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    DrugFormAddEditModalComponent
  ],
  imports:[
    SharedModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers:[DrugFormAddEditModalService, Helper],
  exports: [DrugFormAddEditModalComponent]
})
export class DrugFormAddEditModalModule { }
