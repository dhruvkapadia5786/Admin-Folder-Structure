import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtcCategoriesRoutingModule } from './otc-categories-routing.module';
import { OtcCategoriesComponent } from './otc-categories.component';


@NgModule({
  declarations: [
    OtcCategoriesComponent
  ],
  imports: [
    CommonModule,
    OtcCategoriesRoutingModule
  ]
})
export class OtcCategoriesModule { }
