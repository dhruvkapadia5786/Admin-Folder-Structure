import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { StateAddEditModalComponent } from './state-add-edit-modal.component';
import { StateAddEditModalService } from './state-add-edit-modal.service';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    StateAddEditModalComponent
  ],
  imports: [
    SharedModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers:[StateAddEditModalService, Helper],
  exports: [StateAddEditModalComponent]
})
export class StateAddEditModalModule { }
