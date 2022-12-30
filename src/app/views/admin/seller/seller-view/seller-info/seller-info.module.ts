import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerInfoRoutingModule } from './seller-info-routing.module';
import { SellerInfoComponent } from './seller-info.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SellerInfoComponent
  ],
  imports: [
    SharedModule,
    SellerInfoRoutingModule
  ]
})
export class SellerInfoModule { }
