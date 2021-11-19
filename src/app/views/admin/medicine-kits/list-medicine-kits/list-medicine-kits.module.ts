import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';
import { Helper } from 'src/app/services/helper.service';

import { ListMedicineKitsRoutingModule } from './list-medicine-kits-routing.module';
import { ListMedicineKitsComponent } from './list-medicine-kits.component';

@NgModule({
  declarations:[
    ListMedicineKitsComponent
  ],
  imports:[
    CommonModule,
    FormsModule,
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    ListMedicineKitsRoutingModule
  ],
  providers:[Helper]
})
export class ListMedicineKitsModule { }
