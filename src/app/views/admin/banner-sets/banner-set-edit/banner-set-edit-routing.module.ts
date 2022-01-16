import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerSetEditComponent } from './banner-set-edit.component';

const routes: Routes = [
  {
    path:'',component:BannerSetEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerSetEditRoutingModule { }
