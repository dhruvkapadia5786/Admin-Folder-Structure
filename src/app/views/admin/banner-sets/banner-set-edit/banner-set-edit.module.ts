import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerSetEditRoutingModule } from './banner-set-edit-routing.module';
import { BannerSetEditComponent } from './banner-set-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BannerSetEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    BannerSetEditRoutingModule
  ]
})
export class BannerSetEditModule { }
