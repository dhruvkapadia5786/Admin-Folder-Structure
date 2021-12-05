import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsEditComponent } from './products-edit.component';

const routes: Routes = [
  { path: '', component: ProductsEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsEditRoutingModule { }
