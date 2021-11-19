import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DoctorViewRoutingModule } from './doctor-view-routing.module';
import { DoctorViewComponent } from './doctor-view.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { DoctorPrescribedOrdersModule } from './doctor-prescribed-orders/doctor-prescribed-orders.module';
import { DoctorConsultationsModule } from './doctor-consultations/doctor-consultations.module';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';

@NgModule({
  declarations: [DoctorViewComponent],
  imports: [
    SharedModule,
    DoctorViewRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    MatTabsModule,
    MatDialogModule,
    ImagePreviewModule,
    DoctorPrescribedOrdersModule,
    DoctorConsultationsModule
  ]
})
export class DoctorViewModule { }
