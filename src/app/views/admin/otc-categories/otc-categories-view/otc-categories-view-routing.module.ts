import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { OtcCategoriesViewComponent } from './otc-categories-view.component';

const routes: Routes = [
  {
    path: '', component: OtcCategoriesViewComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./otc-category-info/otc-category-info.module').then(otc=>otc.OtcCategoryInfoModule) },
      { path: 'subcategories', loadChildren:()=>import('./otc-category-subcategories/otc-category-subcategories.module').then(otc=>otc.OtcCategorySubcategoriesModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcCategoriesViewRoutingModule { }
