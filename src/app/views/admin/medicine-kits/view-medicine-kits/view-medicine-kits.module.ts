import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

import { ViewMedicineKitsRoutingModule } from './view-medicine-kits-routing.module';
import { ViewMedicineKitsComponent } from './view-medicine-kits.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicineKitsService } from '../medicine-kits.service';

@NgModule({
  declarations: [ViewMedicineKitsComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatSelectModule,
    ViewMedicineKitsRoutingModule
  ],
  providers: [MedicineKitsService]
})
export class ViewMedicineKitsModule { }
