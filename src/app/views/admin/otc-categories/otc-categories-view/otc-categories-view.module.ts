import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtcCategoriesViewRoutingModule } from './otc-categories-view-routing.module';
import { OtcCategoriesViewComponent } from './otc-categories-view.component';


@NgModule({
  declarations: [
    OtcCategoriesViewComponent
  ],
  imports: [
   CommonModule,
    OtcCategoriesViewRoutingModule
  ]
})
export class OtcCategoriesViewModule { }
