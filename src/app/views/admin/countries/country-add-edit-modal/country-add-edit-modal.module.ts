import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';

import { CountryAddEditModalComponent } from './country-add-edit-modal.component';
import { CountryAddEditModalService } from './country-add-edit-modal.service';

@NgModule({
  declarations: [
    CountryAddEditModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  providers:[CountryAddEditModalService, Helper],
  exports: [CountryAddEditModalComponent]
})
export class CountryAddEditModalModule { }
