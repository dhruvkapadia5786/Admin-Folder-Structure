import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ProductsComponent } from './products.component';

const routes: Routes = [
  {
    path: '', component: ProductsComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadChildren:()=>import('./products-list/products-list.module').then(product => product.ProductsListModule) },
      { path: 'add', loadChildren:()=>import('./products-add/products-add.module').then(product => product.ProductsAddModule) },
      { path: 'view/:id', loadChildren:()=>import('./products-view/products-view.module').then(product => product.ProductsViewModule) },
      { path: 'edit/:id', loadChildren:()=>import('./products-edit/products-edit.module').then(product => product.ProductsEditModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }