import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DoctorRegistrationCodeComponent } from './doctor-registration-code.component';
import {DoctorRegistrationCodeRoutingModule} from './doctor-registration-code-routing.module';
import {DoctorRegistrationCodeService} from './doctor-registration-code.service';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DoctorRegistrationCodeAddEditModalModule } from './doctor-registration-code-add-edit-modal/doctor-registration-code-add-edit-modal.module';
import { DoctorRegistrationCodeAddEditModalComponent } from './doctor-registration-code-add-edit-modal/doctor-registration-code-add-edit-modal.component';

@NgModule({
  declarations: [DoctorRegistrationCodeComponent],
  imports: [
    SharedModule,
    DataTablesModule,
    ModalModule.forRoot(),
    DoctorRegistrationCodeAddEditModalModule,
    DoctorRegistrationCodeRoutingModule
  ],
  providers:[DoctorRegistrationCodeService],
  entryComponents: [DoctorRegistrationCodeAddEditModalComponent]
})
export class DoctorRegistrationCodeModule { }
