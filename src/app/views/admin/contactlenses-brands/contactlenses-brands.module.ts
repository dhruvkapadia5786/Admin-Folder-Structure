import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactlensesBrandsRoutingModule } from './contactlenses-brands-routing.module';
import { ContactlensesBrandsComponent } from './contactlenses-brands.component';
import {ContactlensesBrandsService} from './contactlenses-brands.service'

import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ContactlensesBrandsComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    SharedModule,
    ContactlensesBrandsRoutingModule
  ],
  providers:[ContactlensesBrandsService]
})
export class ContactlensesBrandsModule { }
