import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyUserCreateComponent } from './pharmacy-user-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PharmacyUserCreateRoutingModule } from './pharmacy-user-create-routing.module'
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [PharmacyUserCreateComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    PharmacyUserCreateRoutingModule
  ],
  providers: [Helper]
})
export class PharmacyUserCreateModule { }
