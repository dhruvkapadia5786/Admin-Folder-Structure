import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { PackformAddEditModalComponent } from './packform-add-edit-modal.component';
import { PackformAddEditModalService } from './packform-add-edit-modal.service';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    PackformAddEditModalComponent
  ],
  imports:[
    SharedModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers:[PackformAddEditModalService, Helper],
  exports: [PackformAddEditModalComponent]
})
export class PackformAddEditModalModule { }
