import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsAddRoutingModule } from './products-add-routing.module';
import { ProductsAddComponent } from './products-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    ProductsAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ProductsAddRoutingModule
  ],
  providers:[Helper]
})
export class ProductsAddModule { }
