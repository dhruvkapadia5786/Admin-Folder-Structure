import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoumentListComponent } from './doument-list.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [DoumentListComponent],
  imports: [
    CommonModule,
    DataTablesModule
  ],
  exports: [DoumentListComponent]
})
export class DoumentListModule { }
