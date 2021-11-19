import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditDoctorRoutingModule } from './edit-doctor-routing.module';
import { EditDoctorComponent } from './edit-doctor.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagePreviewModule } from '../../../../shared/image-preview/image-preview.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [EditDoctorComponent],
  imports: [
    CommonModule,
    EditDoctorRoutingModule,
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
export class EditDoctorModule { }
