import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { PharmacyUserManagementRoutingModule } from './pharmacy-user-management-routing.module';
import { PharmacyUserManagementComponent } from './pharmacy-user-management.component';


@NgModule({
  declarations: [PharmacyUserManagementComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    PharmacyUserManagementRoutingModule
  ],
  entryComponents:[]
})
export class PharmacyUserManagementModule { }
