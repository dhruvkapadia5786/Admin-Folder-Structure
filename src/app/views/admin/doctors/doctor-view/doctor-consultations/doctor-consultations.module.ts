import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

import { DoctorConsultationsComponent } from './doctor-consultations.component';
import { DoctorConsultationsRoutingModule } from './doctor-consultations-routing.module';

@NgModule({
  declarations: [DoctorConsultationsComponent],
  imports: [
    SharedModule,
    DoctorConsultationsRoutingModule,
    DataTablesModule
  ],
  exports:[DoctorConsultationsComponent]
})
export class DoctorConsultationsModule { }
