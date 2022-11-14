import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerInfoRoutingModule } from './seller-info-routing.module';
import { SellerInfoComponent } from './seller-info.component';


@NgModule({
  declarations: [
    SellerInfoComponent
  ],
  imports: [
    CommonModule,
    SellerInfoRoutingModule
  ]
})
export class SellerInfoModule { }
