import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerInfoRoutingModule } from './dealer-info-routing.module';
import { DealerInfoComponent } from './dealer-info.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    DealerInfoComponent
  ],
  imports: [
    SharedModule,
    DealerInfoRoutingModule
  ]
})
export class DealerInfoModule { }
