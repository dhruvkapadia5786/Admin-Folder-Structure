import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateTechRoutingModule } from './create-tech-routing.module';
import { CreateTechComponent } from './create-tech.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [CreateTechComponent],
  imports: [
    CommonModule,
    CreateTechRoutingModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  providers: [Helper]
})
export class CreateTechModule { }
