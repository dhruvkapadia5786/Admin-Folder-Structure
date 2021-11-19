import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ClinicService } from './clinic.service';
import { ClinicComponent } from './clinic.component';
import { ClinicRoutingModule } from './clinic-routing.module';
import { ViewClinicComponent } from './view-clinic/view-clinic.component';
import { EditClinicComponent } from './edit-clinic/edit-clinic.component';
import { ListClinicComponent } from './list-clinic/list-clinic.component';
import { AddClinicComponent } from './add-clinic/add-clinic.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

import { DataTablesModule } from 'angular-datatables';
import { MatTabsModule } from '@angular/material/tabs'
import { MatRadioModule } from '@angular/material/radio'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select';

import { DoctorModalModule } from './doctor-modal/doctor-modal.module';
import { DoctorModalComponent } from './doctor-modal/doctor-modal.component';

@NgModule({
  declarations: [ViewClinicComponent, EditClinicComponent, ListClinicComponent, ClinicComponent, AddClinicComponent],
  imports: [
    CommonModule,
    SharedModule,
    PipesModule,
    ClinicRoutingModule,
    MatTabsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    DataTablesModule,
    MatSelectModule,
    ModalModule.forRoot(),
    DoctorModalModule,
  ],
  providers:[ClinicService, BsModalService],
  entryComponents: [DoctorModalComponent]
})
export class ClinicModule { }
