import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';

import { ConsultationListRoutingModule } from './consultation-list-routing.module';
import { ConsultationListComponent } from './consultation-list.component';
import { DataTablesModule } from 'angular-datatables';
import { ConsultationService } from '../consultation.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ConsultationListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatCheckboxModule, 
    MatSelectModule,
    ConsultationListRoutingModule,
    NgxMaskModule,
    DataTablesModule
  ],
  providers:[ConsultationService]
})
export class ConsultationListModule { }
