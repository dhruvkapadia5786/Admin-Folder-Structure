import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTechRoutingModule } from './edit-tech-routing.module';
import { EditTechComponent } from './edit-tech.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [EditTechComponent],
  imports: [
    CommonModule,
    EditTechRoutingModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  providers: [Helper]
})
export class EditTechModule { }
