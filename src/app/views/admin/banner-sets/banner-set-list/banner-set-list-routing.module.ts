import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerSetListComponent } from './banner-set-list.component';

const routes: Routes = [
  {
    path:'',component:BannerSetListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerSetListRoutingModule { }
