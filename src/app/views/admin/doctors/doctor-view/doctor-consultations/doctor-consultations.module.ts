import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

import { DoctorConsultationsComponent } from './doctor-consultations.component';
import { DoctorConsultationsRoutingModule } from './doctor-consultations-routing.module';
import { consultationHelper } from 'src/app/services/consultationHelper.service';

@NgModule({
  declarations: [DoctorConsultationsComponent],
  imports: [
    SharedModule,
    DoctorConsultationsRoutingModule,
    DataTablesModule
  ],
  exports:[DoctorConsultationsComponent],
  providers:[consultationHelper]
})
export class DoctorConsultationsModule { }
