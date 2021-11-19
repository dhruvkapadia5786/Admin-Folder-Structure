import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechniciansRoutingModule } from './technicians-routing.module';
import { TechniciansComponent } from './technicians.component';

@NgModule({
  declarations: [TechniciansComponent],
  imports: [
    CommonModule,
    TechniciansRoutingModule
  ]
})
export class TechniciansModule { }
