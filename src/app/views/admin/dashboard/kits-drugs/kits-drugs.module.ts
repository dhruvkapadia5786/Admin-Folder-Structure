import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitsDrugsRoutingModule } from './kits-drugs-routing.module';
import { KitsDrugsComponent } from './kits-drugs.component';

@NgModule({
  declarations: [KitsDrugsComponent],
  imports: [
    CommonModule,
    KitsDrugsRoutingModule
  ]
})
export class KitsDrugsModule { }
