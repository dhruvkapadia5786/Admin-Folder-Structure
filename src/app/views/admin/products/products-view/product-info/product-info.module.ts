import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductInfoRoutingModule } from './product-info-routing.module';
import { ProductInfoComponent } from './product-info.component';
import { ChangeSequenceModule } from 'src/app/shared/change-sequence/change-sequence.module';


@NgModule({
  declarations: [
    ProductInfoComponent
  ],
  imports: [
    CommonModule,
    ProductInfoRoutingModule,
    ChangeSequenceModule
  ]
})
export class ProductInfoModule { }
