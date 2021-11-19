import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqListRoutingModule } from './faq-list-routing.module';
import { FaqListComponent } from './faq-list.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [FaqListComponent],
  imports: [
    CommonModule,
    SharedModule,
    FaqListRoutingModule,
    DataTablesModule,
  ]
})
export class FaqListModule { }
