import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOrdersComponent } from './admin-orders.component';
import { AdminOrdersRoutingModule } from './admin-orders-routing.module';

@NgModule({
  declarations: [AdminOrdersComponent],
  imports: [
    AdminOrdersRoutingModule,
    CommonModule
  ]
})
export class AdminOrdersModule { }
