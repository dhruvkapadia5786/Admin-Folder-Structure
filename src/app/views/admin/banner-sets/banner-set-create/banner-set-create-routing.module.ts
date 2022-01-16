import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerSetCreateComponent } from './banner-set-create.component';

const routes: Routes = [
  {
    path:'',component:BannerSetCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerSetCreateRoutingModule { }
