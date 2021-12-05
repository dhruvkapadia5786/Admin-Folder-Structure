import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtcCategoryInfoComponent } from './otc-category-info.component';

const routes: Routes = [
  {
    path:'',component:OtcCategoryInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcCategoryInfoRoutingModule { }
