import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerSetViewRoutingModule } from './banner-set-view-routing.module';
import { BannerSetViewComponent } from './banner-set-view.component';


@NgModule({
  declarations: [
    BannerSetViewComponent
  ],
  imports: [
    CommonModule,
    BannerSetViewRoutingModule
  ]
})
export class BannerSetViewModule { }
