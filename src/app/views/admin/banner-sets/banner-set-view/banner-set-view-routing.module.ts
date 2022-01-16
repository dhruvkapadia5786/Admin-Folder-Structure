import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerSetViewComponent } from './banner-set-view.component';

const routes: Routes = [
  {
    path:'',component:BannerSetViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerSetViewRoutingModule { }
