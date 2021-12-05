import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtcCategorySubcategoriesComponent } from './otc-category-subcategories.component';

const routes: Routes = [{
  path:'',component:OtcCategorySubcategoriesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcCategorySubcategoriesRoutingModule { }
