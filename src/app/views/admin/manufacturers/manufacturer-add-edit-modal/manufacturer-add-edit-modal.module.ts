import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { ManufacturerAddEditModalComponent } from './manufacturer-add-edit-modal.component';
import { ManufacturerAddEditModalService } from './manufacturer-add-edit-modal.service';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    ManufacturerAddEditModalComponent
  ],
  imports: [
    SharedModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers:[ManufacturerAddEditModalService, Helper],
  exports: [ManufacturerAddEditModalComponent]
})
export class ManufacturerAddEditModalModule { }
