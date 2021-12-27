import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultationsRoutingModule } from './consultations-routing.module';
import { ConsultationsComponent } from './consultations.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ConsultationsComponent],
  imports: [
    CommonModule,
    ConsultationsRoutingModule,
    NgxMaskModule,
    DataTablesModule
  ]
})
export class ConsultationsModule { }