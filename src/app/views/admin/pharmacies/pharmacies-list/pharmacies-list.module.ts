import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PharmaciesListRoutingModule } from './pharmacies-list-routing.module';
import { PharmaciesListComponent } from './pharmacies-list.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [PharmaciesListComponent],
  imports: [
    CommonModule,
    NgxMaskModule,
    DataTablesModule,
    PharmaciesListRoutingModule
  ],
  providers: [Helper]
})
export class PharmaciesListModule { }
