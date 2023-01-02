import { NgModule } from '@angular/core';

import { ProductReviewsRoutingModule } from './product-reviews-routing.module';
import { ProductReviewsComponent } from './product-reviews.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProductReviewsComponent
  ],
  imports: [
    SharedModule,
    ProductReviewsRoutingModule
  ]
})
export class ProductReviewsModule { }
