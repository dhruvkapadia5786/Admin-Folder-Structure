import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { TherapyAddEditModalComponent } from './therapy-add-edit-modal.component';
import { TherapyAddEditModalService } from './therapy-add-edit-modal.service';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    TherapyAddEditModalComponent
  ],
  imports:[
    SharedModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers:[TherapyAddEditModalService, Helper],
  exports: [TherapyAddEditModalComponent]
})
export class TherapyAddEditModalModule { }
