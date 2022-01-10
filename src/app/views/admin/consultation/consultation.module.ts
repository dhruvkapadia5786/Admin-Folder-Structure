import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultationRoutingModule } from './consultation-routing.module';
import { ConsultationComponent } from './consultation.component';
import { ConsultationViewComponent } from './consultation-view/consultation-view.component';
import { ConsultationService } from './consultation.service';
import { DataTablesModule } from 'angular-datatables';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { NgxMaskModule } from 'ngx-mask';
import { OrderLogsModule } from 'src/app/components/order-logs/order-logs.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { consultationHelper } from 'src/app/services/consultationHelper.service';
import { ChangeAddressModalComponent } from 'src/app/components/change-address-modal/change-address-modal.component';
import { ChangeAddressModalModule } from 'src/app/components/change-address-modal/change-address-modal.module';

@NgModule({
  declarations: [ConsultationComponent, ConsultationViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxMaskModule,
    ConsultationRoutingModule,
    ImagePreviewModule,
    OrderLogsModule,
    ChangeAddressModalModule
  ],
  providers:[ConsultationService,consultationHelper],
  entryComponents:[ChangeAddressModalComponent]
})
export class ConsultationModule { }
