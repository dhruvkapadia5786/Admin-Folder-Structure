import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerSetsRoutingModule } from './banner-sets-routing.module';
import { BannerSetsComponent } from './banner-sets.component';


@NgModule({
  declarations: [
    BannerSetsComponent
  ],
  imports: [
    CommonModule,
    BannerSetsRoutingModule
  ]
})
export class BannerSetsModule { }
