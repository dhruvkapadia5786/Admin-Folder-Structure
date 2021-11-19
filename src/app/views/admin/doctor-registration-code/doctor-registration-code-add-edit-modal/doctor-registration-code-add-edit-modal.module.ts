import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Helper } from 'src/app/services/helper.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DoctorRegistrationCodeAddEditModalComponent } from './doctor-registration-code-add-edit-modal.component';
import { DoctorRegistrationCodeAddEditModalService } from './doctor-registration-code-add-edit-modal.service';

@NgModule({
  declarations: [
    DoctorRegistrationCodeAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DoctorRegistrationCodeAddEditModalService, Helper],
  exports: [DoctorRegistrationCodeAddEditModalComponent]
})
export class DoctorRegistrationCodeAddEditModalModule { }
