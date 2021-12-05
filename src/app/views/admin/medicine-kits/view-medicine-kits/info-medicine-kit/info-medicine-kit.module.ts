import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { InfoMedicineKitRoutingModule } from './info-medicine-kit-routing.module';
import { InfoMedicineKitComponent } from './info-medicine-kit.component';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ChangeSequenceModule } from 'src/app/shared/change-sequence/change-sequence.module';

@NgModule({
  declarations: [InfoMedicineKitComponent],
  imports: [
  CommonModule,
    FormsModule,
    InfoMedicineKitRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    MatSlideToggleModule,
    ImagePreviewModule,
    MatTabsModule,
    ChangeSequenceModule
  ]
})
export class InfoMedicineKitModule { }
