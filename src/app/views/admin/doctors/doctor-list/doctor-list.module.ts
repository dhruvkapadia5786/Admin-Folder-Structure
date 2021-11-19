import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorListRoutingModule } from './doctor-list-routing.module';
import { DoctorListComponent } from './doctor-list.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [DoctorListComponent],
  imports: [
    CommonModule,
    DoctorListRoutingModule,
    NgxMaskModule,
    NgxPaginationModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [Helper]
})
export class DoctorListModule { }
