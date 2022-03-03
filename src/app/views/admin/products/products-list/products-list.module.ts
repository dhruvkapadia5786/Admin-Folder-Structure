import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';
import { Helper } from 'src/app/services/helper.service';

import { ProductsListRoutingModule } from './products-list-routing.module';
import { ProductsListComponent } from './products-list.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    ProductsListComponent
  ],
  imports: [
   CommonModule,
    FormsModule,
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    MatSelectModule,
    MatCheckboxModule,
    ProductsListRoutingModule
  ],
  providers:[Helper]
})
export class ProductsListModule { }
