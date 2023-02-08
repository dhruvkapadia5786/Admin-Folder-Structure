import { NgModule } from '@angular/core';
import { ProductsListRoutingModule } from './products-list-routing.module';
import { ProductsListComponent } from './products-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductsFilterModalModule } from '../products-filter-modal/products-filter-modal.module';


@NgModule({
  declarations: [
    ProductsListComponent
  ],
  imports: [
    SharedModule,
    ProductsFilterModalModule,
    ProductsListRoutingModule
  ]
})
export class ProductsListModule { }
