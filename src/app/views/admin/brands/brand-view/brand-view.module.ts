import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandViewRoutingModule } from './brand-view-routing.module';
import { BrandViewComponent } from './brand-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    BrandViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    BrandViewRoutingModule
  ]
})
export class BrandViewModule { }
