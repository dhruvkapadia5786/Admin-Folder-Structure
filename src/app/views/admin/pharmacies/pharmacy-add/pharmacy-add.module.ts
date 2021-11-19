import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PharmacyAddRoutingModule } from './pharmacy-add-routing.module';
import { PharmacyAddComponent } from './pharmacy-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [PharmacyAddComponent],
  imports: [
    CommonModule,
    PharmacyAddRoutingModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule
  ]
})
export class PharmacyAddModule { }
