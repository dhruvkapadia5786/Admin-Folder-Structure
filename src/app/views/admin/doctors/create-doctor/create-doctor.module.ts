import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

import { CreateDoctorRoutingModule } from './create-doctor-routing.module';
import { CreateDoctorComponent } from './create-doctor.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';


@NgModule({
  declarations: [CreateDoctorComponent],
  imports: [
    CommonModule,
    SharedModule,
    CreateDoctorRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule,
    ImagePreviewModule
  ]
})
export class CreateDoctorModule { }
