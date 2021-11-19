import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineKitsComponent } from './medicine-kits.component';
import { MedicineKitsRoutingModule } from './medicine-kits-routing.module';
@NgModule({
  declarations: [MedicineKitsComponent],
  imports: [
    CommonModule,
    MedicineKitsRoutingModule
  ]
})
export class MedicineKitsModule { }
