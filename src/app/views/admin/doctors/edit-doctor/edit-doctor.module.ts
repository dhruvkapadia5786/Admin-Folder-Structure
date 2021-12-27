import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditDoctorRoutingModule } from './edit-doctor-routing.module';
import { EditDoctorComponent } from './edit-doctor.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { ImagePreviewModule } from '../../../../shared/image-preview/image-preview.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [EditDoctorComponent],
  imports: [
    CommonModule,
    EditDoctorRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    MatRadioModule,
    BsDatepickerModule.forRoot(),
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule,
    ImagePreviewModule
  ]
})
export class EditDoctorModule { }
