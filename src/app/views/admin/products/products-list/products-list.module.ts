import { NgModule } from '@angular/core';
import { ProductsListRoutingModule } from './products-list-routing.module';
import { ProductsListComponent } from './products-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProductsListComponent
  ],
  imports: [
    SharedModule,
    ProductsListRoutingModule
  ]
})
export class ProductsListModule { }
