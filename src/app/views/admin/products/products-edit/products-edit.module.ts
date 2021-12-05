import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsEditRoutingModule } from './products-edit-routing.module';
import { ProductsEditComponent } from './products-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';



@NgModule({
  declarations: [
    ProductsEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ProductsEditRoutingModule
  ],
  providers:[Helper]
})
export class ProductsEditModule { }
