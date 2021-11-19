import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PharmaciesRoutingModule } from './pharmacies-routing.module';
import { PharmaciesComponent } from './pharmacies.component';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [PharmaciesComponent],
  imports: [
    CommonModule,
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    PharmaciesRoutingModule
  ]
})
export class PharmaciesModule { }
