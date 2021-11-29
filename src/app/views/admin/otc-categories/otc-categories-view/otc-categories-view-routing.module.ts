import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtcCategoriesViewComponent } from './otc-categories-view.component';

const routes: Routes = [
  { path: '', component: OtcCategoriesViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcCategoriesViewRoutingModule { }
