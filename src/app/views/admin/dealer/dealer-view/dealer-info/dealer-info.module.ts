import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerInfoRoutingModule } from './dealer-info-routing.module';
import { DealerInfoComponent } from './dealer-info.component';


@NgModule({
  declarations: [
    DealerInfoComponent
  ],
  imports: [
    CommonModule,
    DealerInfoRoutingModule
  ]
})
export class DealerInfoModule { }
