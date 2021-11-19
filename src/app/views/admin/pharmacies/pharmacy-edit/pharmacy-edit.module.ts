import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { PharmacyEditRoutingModule } from './pharmacy-edit-routing.module';
import { PharmacyEditComponent } from './pharmacy-edit.component';
import { ImagePreviewModule } from '../../../../shared/image-preview/image-preview.module';

@NgModule({
  declarations: [PharmacyEditComponent],
  imports: [
    CommonModule,
    PharmacyEditRoutingModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    ImagePreviewModule
  ]
})
export class PharmacyEditModule { }
