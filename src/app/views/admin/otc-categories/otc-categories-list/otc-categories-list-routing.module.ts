import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtcCategoriesListComponent } from './otc-categories-list.component';

const routes: Routes = [
  { path: '', component: OtcCategoriesListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcCategoriesListRoutingModule { }
