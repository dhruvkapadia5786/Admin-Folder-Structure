import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyListRoutingModule } from './policy-list-routing.module';
import { PolicyListComponent } from './policy-list.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [PolicyListComponent],
  imports: [
    CommonModule,
    SharedModule,
    PolicyListRoutingModule,
    DataTablesModule,
  ]
})
export class PolicyListModule { }
