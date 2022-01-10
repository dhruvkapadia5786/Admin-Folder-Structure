import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactlensesProductsComponent } from './contactlenses-products.component';

const routes: Routes = [{
  path:'',component:ContactlensesProductsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactlensesProductsRoutingModule { }
