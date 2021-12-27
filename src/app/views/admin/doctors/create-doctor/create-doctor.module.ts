import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

import { CreateDoctorRoutingModule } from './create-doctor-routing.module';
import { CreateDoctorComponent } from './create-doctor.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [CreateDoctorComponent],
  imports: [
    CommonModule,
    SharedModule,
    CreateDoctorRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule,
    BsDatepickerModule.forRoot(),
    ImagePreviewModule
  ]
})
export class CreateDoctorModule { }
