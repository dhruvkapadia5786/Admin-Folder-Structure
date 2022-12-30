import { NgModule } from '@angular/core';

import { ProductInfoRoutingModule } from './product-info-routing.module';
import { ProductInfoComponent } from './product-info.component';
import { ChangeSequenceModule } from 'src/app/shared/change-sequence/change-sequence.module';
import { Helper } from 'src/app/services/helper.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProductInfoComponent
  ],
  imports: [
    SharedModule,
    ProductInfoRoutingModule,
    ChangeSequenceModule
  ],
  providers:[Helper]
})
export class ProductInfoModule { }
